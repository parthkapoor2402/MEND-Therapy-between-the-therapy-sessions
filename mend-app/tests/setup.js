import '@testing-library/jest-dom'

// jsdom does not implement scrollTo; ScrollToTop calls it on route change.
window.scrollTo = () => {}
