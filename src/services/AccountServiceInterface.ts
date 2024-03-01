export default interface AccountServiceInterface {
  setAccount: (userName: string) => void
  getAccount: () => any
  getUserName: () => string
  removeAccount: () => any
}