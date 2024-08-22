import { AppContentLayoutNav, NavbarType } from '@layouts/enums'
import { _setDirAttr } from '@layouts/utils'

// ℹ️ We should not import themeConfig here but in urgency we are doing it for now
import { layoutConfig } from '@themeConfig'

export const namespaceConfig = (str: string) => `${layoutConfig.app.title}-${str}`

export const cookieRef = <T>(key: string, defaultValue: T) => {
  return useCookie<T>(namespaceConfig(key), { default: () => defaultValue })
}

export const useLayoutConfigStore = defineStore('layoutConfig', () => {
  const route = useRoute()

  // 👉 Navbar Type
  const navbarType = ref(layoutConfig.navbar.type)

  // 👉 Navbar Type
  const isNavbarBlurEnabled = cookieRef('isNavbarBlurEnabled', layoutConfig.navbar.navbarBlur)

  // 👉 App Content Width
  const appContentWidth = cookieRef('appContentWidth', layoutConfig.app.contentWidth)

  // 👉 App Content Layout Nav
  const appContentLayoutNav = ref(layoutConfig.app.contentLayoutNav)

  watch(appContentLayoutNav, val => {
    // If Navbar type is hidden while switching to horizontal nav => Reset it to sticky
    if (val === AppContentLayoutNav.Horizontal) {
      if (navbarType.value === NavbarType.Hidden)
        navbarType.value = NavbarType.Sticky
      console.log('test')

      // isVerticalNavCollapsed.value = false
    }
  })

  // 👉 Horizontal Nav Type
  const horizontalNavType = ref(layoutConfig.horizontalNav.type)

  // 👉 Footer Type
  const footerType = ref(layoutConfig.footer.type)

  // 👉 Misc
  const isLessThanOverlayNavBreakpoint = computed(() => useMediaQuery(`(max-width: ${layoutConfig.app.overlayNavFromBreakpoint}px)`).value)

  // 👉 Layout Classes
  const _layoutClasses = computed(() => {
    const { y: windowScrollY } = useWindowScroll()

    return [
      `layout-nav-type-${appContentLayoutNav.value}`,
      `layout-navbar-${navbarType.value}`,
      `layout-footer-${footerType.value}`,
      { [`horizontal-nav-${horizontalNavType.value}`]: appContentLayoutNav.value === 'horizontal' },
      `layout-content-width-${appContentWidth.value}`,
      { 'layout-overlay-nav': isLessThanOverlayNavBreakpoint.value },
      { 'window-scrolled': unref(windowScrollY) },
      route.meta.layoutWrapperClasses ? route.meta.layoutWrapperClasses : null,
    ]
  })

  // 👉 RTL
  // const isAppRTL = ref(layoutConfig.app.isRTL)
  const isAppRTL = ref(false)

  watch(isAppRTL, val => {
    _setDirAttr(val ? 'rtl' : 'ltr')
  })

  // 👉 Is Vertical Nav Mini
  /*
    This function will return true if current state is mini. Mini state means vertical nav is:
      - Collapsed
      - Isn't hovered by mouse
      - nav is not less than overlay breakpoint (hence, isn't overlay menu)

    ℹ️ We are getting `isVerticalNavHovered` as param instead of via `inject` because
        we are using this in `VerticalNav.vue` component which provide it and I guess because
        same component is providing & injecting we are getting undefined error
  */

  return {
    appContentWidth,
    appContentLayoutNav,
    navbarType,
    isNavbarBlurEnabled,
    horizontalNavType,
    footerType,
    isLessThanOverlayNavBreakpoint,
    isAppRTL,
    _layoutClasses,
  }
})
