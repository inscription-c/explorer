export interface GlobalPopupState {
  show: boolean,
  type: 'error' | 'success' | 'info' | 'warning',
  icon: string,
  title: string,
  message: string,
}
