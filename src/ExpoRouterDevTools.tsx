import { useGlobalSearchParams, usePathname, useRouter, type RelativePathString } from 'expo-router'
import * as SecureStore from 'expo-secure-store'
import React, { useCallback, useEffect, useState } from 'react'
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { ExpoRouterDevToolsProps, SavedRoute } from './interfaces/base'

const STORAGE_PREFIX = 'expo-router-devtools_'
const MAX_HISTORY = 10

const ExpoRouterDevTools: React.FC<ExpoRouterDevToolsProps> = ({
  position = 'top',
  hideInProduction = true,
  storageKeyPrefix = STORAGE_PREFIX,
  onRouteChange,
  enableHistory = true,
  maxHistory = MAX_HISTORY,
  maxNumOfLines = 3,
}) => {
  const pathname = usePathname()
  const searchParams = useGlobalSearchParams()
  const router = useRouter()

  const [currentRoute, setCurrentRoute] = useState('')
  const [savedRoutes, setSavedRoutes] = useState<SavedRoute[]>([])
  const [routeHistory, setRouteHistory] = useState<string[]>([])
  const [isExpanded, setIsExpanded] = useState(false)
  const [showHistory, setShowHistory] = useState(false)

  const SAVED_ROUTES_KEY = `${storageKeyPrefix}saved-routes`
  const HISTORY_KEY = `${storageKeyPrefix}history`

  // Build current full route
  useEffect(() => {
    const query = Object.keys(searchParams).length
      ? '?' +
        Object.entries(searchParams)
          .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
          .join('&')
      : ''

    const fullRoute = `${pathname}${query}`
    setCurrentRoute(fullRoute)
    onRouteChange?.(fullRoute)
  }, [pathname, searchParams, onRouteChange])

  // Load saved routes and history
  useEffect(() => {
    const loadData = async () => {
      try {
        const savedRoutesData = await SecureStore.getItemAsync(SAVED_ROUTES_KEY)
        if (savedRoutesData) {
          setSavedRoutes(JSON.parse(savedRoutesData))
        }

        if (enableHistory) {
          const historyData = await SecureStore.getItemAsync(HISTORY_KEY)
          if (historyData) {
            setRouteHistory(JSON.parse(historyData))
          }
        }
      } catch (error) {
        console.error('[ExpoRouterDevTools] Error loading data:', error)
      }
    }

    loadData()
  }, [SAVED_ROUTES_KEY, HISTORY_KEY, enableHistory])

  // Update history when route changes
  useEffect(() => {
    if (!enableHistory || !currentRoute) return

    const updateHistory = async () => {
      try {
        const newHistory = [currentRoute, ...routeHistory.filter((r) => r !== currentRoute)].slice(0, maxHistory)
        setRouteHistory(newHistory)
        await SecureStore.setItemAsync(HISTORY_KEY, JSON.stringify(newHistory))
      } catch (error) {
        console.error('[ExpoRouterDevTools] Error updating history:', error)
      }
    }

    updateHistory()
  }, [currentRoute, enableHistory, maxHistory, HISTORY_KEY])

  // Save current route
  const saveRoute = useCallback(async () => {
    const label = `Route ${savedRoutes.length + 1}`
    const newRoute: SavedRoute = {
      route: currentRoute,
      label,
      timestamp: Date.now(),
    }

    const updated = [...savedRoutes, newRoute]
    setSavedRoutes(updated)

    try {
      await SecureStore.setItemAsync(SAVED_ROUTES_KEY, JSON.stringify(updated))
    } catch (error) {
      console.error('[ExpoRouterDevTools] Error saving route:', error)
    }
  }, [currentRoute, savedRoutes, SAVED_ROUTES_KEY])

  // Navigate to route
  const navigateToRoute = useCallback(
    (route: string) => {
      try {
        router.push(route as RelativePathString)
      } catch (error) {
        console.error('[ExpoRouterDevTools] Navigation error:', error)
      }
    },
    [router]
  )

  // Delete saved route
  const deleteSavedRoute = useCallback(
    async (index: number) => {
      const updated = savedRoutes.filter((_, i) => i !== index)
      setSavedRoutes(updated)

      try {
        await SecureStore.setItemAsync(SAVED_ROUTES_KEY, JSON.stringify(updated))
      } catch (error) {
        console.error('[ExpoRouterDevTools] Error deleting route:', error)
      }
    },
    [savedRoutes, SAVED_ROUTES_KEY]
  )

  // Clear all data
  const clearAll = useCallback(async () => {
    setSavedRoutes([])
    setRouteHistory([])

    try {
      await SecureStore.deleteItemAsync(SAVED_ROUTES_KEY)
      await SecureStore.deleteItemAsync(HISTORY_KEY)
    } catch (error) {
      console.error('[ExpoRouterDevTools] Error clearing data:', error)
    }
  }, [SAVED_ROUTES_KEY, HISTORY_KEY])

  const styles = createStyles(position)

  // Check if we should render in production
  if (hideInProduction && !__DEV__) {
    return null
  }

  return (
    <View style={styles.container}>
      {/* Current route bar */}
      <Pressable onPress={() => setIsExpanded(!isExpanded)} style={styles.routeBar}>
        <Text style={styles.routeText} numberOfLines={maxNumOfLines}>
          🛣️ {currentRoute || '/'}
        </Text>
        <Text style={styles.expandIcon}>{isExpanded ? '▼' : '▶'}</Text>
      </Pressable>

      {/* Expanded controls */}
      {isExpanded && (
        <View style={styles.controls}>
          {/* Action buttons */}
          <View style={styles.buttonRow}>
            <Pressable onPress={saveRoute} style={styles.button}>
              <Text style={styles.buttonText}>Save</Text>
            </Pressable>

            {enableHistory && (
              <Pressable onPress={() => setShowHistory(!showHistory)} style={styles.button}>
                <Text style={styles.buttonText}>History</Text>
              </Pressable>
            )}

            <Pressable onPress={clearAll} style={[styles.button, styles.dangerButton]}>
              <Text style={styles.buttonText}>Clear</Text>
            </Pressable>
          </View>

          {/* History section */}
          {showHistory && enableHistory && routeHistory.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Recent Routes</Text>
              <ScrollView style={styles.listContainer}>
                {routeHistory.map((route, index) => (
                  <Pressable
                    key={`${route}-${index}`}
                    onPress={() => navigateToRoute(route)}
                    style={({ pressed }) => [styles.listItem, route === currentRoute && styles.selectedItem, pressed && styles.listItemPressed]}
                  >
                    <Text style={styles.listItemText} numberOfLines={1}>
                      {route}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Saved routes section */}
          {savedRoutes.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Saved Routes</Text>
              <ScrollView style={styles.listContainer}>
                {savedRoutes.map((saved, index) => (
                  <Pressable
                    key={`${saved.route}-${index}`}
                    onPress={() => navigateToRoute(saved.route)}
                    style={({ pressed }) => [styles.savedItem, saved.route === currentRoute && styles.selectedItem, pressed && styles.listItemPressed]}
                  >
                    <View style={styles.savedItemContent}>
                      <Text style={styles.savedItemLabel}>{saved.label}</Text>
                      <Text style={styles.listItemText} numberOfLines={1}>
                        {saved.route}
                      </Text>
                    </View>
                    <Pressable
                      onPress={(e) => {
                        e.stopPropagation?.()
                        deleteSavedRoute(index)
                      }}
                      style={styles.deleteButton}
                    >
                      <Text style={styles.deleteButtonText}>✕</Text>
                    </Pressable>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      )}
    </View>
  )
}

const createStyles = (position: 'top' | 'bottom') => {
  const bgColor = '#ffffff'
  const textColor = '#333333'
  const borderColor = '#dddddd'
  const buttonBg = '#2563eb'
  const secondaryBg = '#f5f5f5'
  const pressedBg = '#dbeafe'

  return StyleSheet.create({
    container: {
      backgroundColor: bgColor,
      borderTopWidth: position === 'bottom' ? 1 : 0,
      borderBottomWidth: position === 'top' ? 1 : 0,
      borderColor,
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        android: {
          elevation: 4,
        },
      }),
    },
    selectedItem: {
      backgroundColor: pressedBg,
      borderWidth: 1,
      borderColor: '#2563eb',
    },

    routeBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 12,
      paddingHorizontal: 16,
    },
    routeText: {
      flex: 1,
      fontSize: 12,
      color: textColor,
      fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    },
    expandIcon: {
      fontSize: 16,
      color: textColor,
      marginLeft: 8,
    },
    controls: {
      padding: 12,
      paddingTop: 0,
    },
    buttonRow: {
      flexDirection: 'row',
      gap: 8,
      marginBottom: 12,
    },
    button: {
      flex: 1,
      paddingHorizontal: 12,
      paddingVertical: 8,
      backgroundColor: buttonBg,
      borderRadius: 6,
      alignItems: 'center',
    },
    dangerButton: {
      backgroundColor: '#dc2626',
    },
    buttonText: {
      color: '#ffffff',
      fontSize: 12,
      fontWeight: '600',
    },
    section: {
      marginTop: 12,
    },
    sectionTitle: {
      fontSize: 11,
      fontWeight: '600',
      color: textColor,
      marginBottom: 8,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    listContainer: {
      maxHeight: 150,
    },
    listItem: {
      padding: 8,
      backgroundColor: secondaryBg,
      borderRadius: 4,
      marginBottom: 4,
    },
    listItemPressed: {
      backgroundColor: pressedBg,
    },
    listItemText: {
      fontSize: 11,
      color: textColor,
      fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    },
    savedItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: secondaryBg,
      borderRadius: 4,
      marginBottom: 4,
      overflow: 'hidden',
    },
    savedItemContent: {
      flex: 1,
      padding: 8,
    },
    savedItemLabel: {
      fontSize: 10,
      fontWeight: '600',
      color: buttonBg,
      marginBottom: 2,
    },
    deleteButton: {
      padding: 8,
      paddingHorizontal: 12,
      backgroundColor: '#dc2626',
    },
    deleteButtonText: {
      color: '#ffffff',
      fontSize: 14,
      fontWeight: 'bold',
    },
  })
}

export default ExpoRouterDevTools
