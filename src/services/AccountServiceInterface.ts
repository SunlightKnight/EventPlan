// AccountServiceProvider MUST implement all the functions defined inside its interface.
export default interface AccountServiceInterface {
  setAccount: (userName: string) => void
  getAccount: () => any
  getUserName: () => string
  removeAccount: () => any
}