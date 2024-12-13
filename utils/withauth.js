import { useAuth } from "./AuthContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Login2 from "../app/authentication/login/page";

const withAuth = (WrappedComponent) => {
  const ComponentWithAuth = (props) => {
    const { user } = useAuth()
    const router = useRouter()

    useEffect(() => {
      if (!user) {
        router.replace("/")
      }
    }, [user, router])

    if (!user) {
      return <Login2/>
    }

    return <WrappedComponent {...props} />
  }

  ComponentWithAuth.displayName = `withAuth(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`

  return ComponentWithAuth
}

export default withAuth