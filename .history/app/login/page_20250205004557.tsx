'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()
  const { toast } = useToast()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (username === 'Heizungsplakette' && password === 'Heizungsplakette2025!.!_safe') {
      // Successful login
      toast({
        title: "Erfolgreich eingeloggt",
        description: "Sie werden zum Dashboard weitergeleitet.",
      })
      // In a real application, you would set some authentication state here
      // For now, we'll just redirect to the dashboard
      router.push('/dashboard')
    } else {
      // Failed login
      toast({
        title: "Anmeldung fehlgeschlagen",
        description: "Bitte überprüfen Sie Ihren Benutzernamen und Ihr Passwort.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Heizungsplakette Login</CardTitle>
          <CardDescription>Geben Sie Ihre Anmeldedaten ein, um fortzufahren.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="username">Benutzername</Label>
                <Input 
                  id="username" 
                  placeholder="Benutzername eingeben" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Passwort</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="Passwort eingeben"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Abbrechen</Button>
          <Button onClick={handleLogin}>Anmelden</Button>
        </CardFooter>
      </Card>
    </div>
  )
}