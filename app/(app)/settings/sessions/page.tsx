"use client"

import { authClient } from "@/lib/auth-client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { revokeSessionAction, signOutAllSessionsAction } from "./actions"
import { formatDistanceToNow } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Laptop, Smartphone, Globe, Monitor, RefreshCw } from "lucide-react"
import { useEffect, useState } from "react"

interface Session {
  id: string
  userId: string
  ipAddress?: string | null
  userAgent?: string | null
  expiresAt: Date
  createdAt: Date
}

function getDeviceIcon(userAgent: string | null | undefined) {
  if (!userAgent) return <Globe className="h-4 w-4" />
  const ua = userAgent.toLowerCase()
  if (ua.includes("mobile") || ua.includes("android") || ua.includes("iphone")) {
    return <Smartphone className="h-4 w-4" />
  }
  if (ua.includes("tablet") || ua.includes("ipad")) {
    return <Laptop className="h-4 w-4" />
  }
  return <Monitor className="h-4 w-4" />
}

export default function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string>("")
  const [currentToken, setCurrentToken] = useState<string>("")

  useEffect(() => {
    async function loadData() {
      try {
        const sessionResponse = await authClient.getSession()
        if (sessionResponse?.data?.user) {
          setUserId(sessionResponse.data.user.id)
          setCurrentToken(sessionResponse.data.session.token)
        }
        
        const sessionsResponse = await authClient.listSessions()
        if (sessionsResponse.data) {
          setSessions(sessionsResponse.data as Session[])
        }
      } catch (error) {
        console.error("Error loading sessions:", error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const handleRevoke = async (sessionToken: string) => {
    try {
      await revokeSessionAction(sessionToken)
      setSessions(sessions.filter(s => s.id !== sessionToken))
    } catch (error) {
      console.error("Error revoking session:", error)
    }
  }

  const handleSignOutAll = async () => {
    try {
      await signOutAllSessionsAction()
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  if (sessions.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Active Sessions</h1>
          <p className="text-muted-foreground">
            No active sessions found.
          </p>
        </div>
      </div>
    )
  }

  const userSessions = sessions.filter((s) => s.userId === userId)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Active Sessions</h1>
          <p className="text-muted-foreground">
            Manage your active login sessions across devices
          </p>
        </div>
        {userSessions.length > 1 && (
          <Button variant="outline" onClick={handleSignOutAll}>
            Sign out all other sessions
          </Button>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
          <Badge variant="default" className="bg-green-600">Current</Badge>
          <span className="text-sm text-green-800">
            This is your current session
          </span>
        </div>

        {userSessions.map((session) => {
          const isCurrentSession = session.id === currentToken
          return (
            <Card key={session.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getDeviceIcon(session.userAgent)}
                    <div>
                      <CardTitle className="text-base">
                        {session.userAgent?.split(" ").slice(0, 2).join(" ") || "Unknown Device"}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {session.ipAddress || "Unknown location"}
                      </p>
                    </div>
                  </div>
                  {!isCurrentSession && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleRevoke(session.id)}
                    >
                      Revoke
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p>Last active: {formatDistanceToNow(new Date(session.expiresAt), { addSuffix: true })}</p>
                {session.createdAt && (
                  <p>Created: {formatDistanceToNow(new Date(session.createdAt), { addSuffix: true })}</p>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card className="border-amber-200 bg-amber-50">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <CardTitle className="text-base text-amber-800">Security Tip</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="text-sm text-amber-700">
          <p>
            If you see any unfamiliar sessions, revoke them immediately and consider changing your password.
            Regular review of active sessions helps keep your account secure.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
