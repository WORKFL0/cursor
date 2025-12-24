import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Home, ArrowLeft, Search, WifiOff, Computer, HardDrive, AlertTriangle } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        {/* Error Code with IT Humor */}
        <div className="space-y-4">
          <div className="flex items-center justify-center space-x-4 text-6xl font-bold">
            <Computer className="w-16 h-16 text-workflo-yellow" />
            <span className="text-workflo-yellow">404</span>
            <HardDrive className="w-16 h-16 text-workflo-yellow" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">
              Error 404: Pagina Niet Gevonden
            </h1>
            <p className="text-lg text-muted-foreground">
              Oeps! Deze pagina heeft blijkbaar een Blue Screen of Death gehad...
            </p>
          </div>
        </div>

        {/* Enhanced IT Humor Card */}
        <Card className="bg-card border-2 border-workflo-yellow/40 bg-workflo-yellow/8 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-foreground">
              <AlertTriangle className="w-5 h-5 animate-pulse" />
              System Error Report
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="bg-muted/60 p-4 rounded-lg font-mono text-left border border-workflo-yellow/20">
              <p className="text-workflo-yellow font-bold animate-pulse">STOP: 0x00000404 PAGE_NOT_FOUND</p>
              <p className="text-muted-foreground mt-2 font-semibold">
                Technical Information:
              </p>
              <ul className="text-muted-foreground mt-1 space-y-1">
                <li>• Status: Pagina tijdelijk verdwenen naar de digitale Bermuda Triangle</li>
                <li>• Mogelijke oorzaken: Te veel koffie bij de developers ☕</li>
                <li>• Oplossing: Hebben we al geprobeerd uit en aan te zetten? 🔄</li>
                <li>• ETA voor fix: Zodra IT heeft uitgevogeld waar ze hun USB-stick hebben gelaten 💾</li>
                <li>• Workaround: Navigeer naar een werkende pagina (zie opties hieronder) 🎯</li>
              </ul>
            </div>
            
            <div className="text-center py-2">
              <p className="text-sm text-muted-foreground italic">
                💡 <strong>Workflo tip:</strong> Net als bij echte IT-problemen, heb je het al geprobeerd uit en weer aan te zetten?
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Helpful Actions */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">
            Geen paniek! Hier zijn wat troubleshooting opties:
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button asChild className="flex items-center gap-2 h-12 bg-workflo-yellow text-black hover:bg-workflo-yellow/90 font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200">
              <Link href="/">
                <Home className="w-4 h-4" />
                Terug naar Home
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="flex items-center gap-2 h-12 border-2 border-workflo-yellow/50 hover:bg-workflo-yellow/10 hover:border-workflo-yellow font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200">
              <Link href="/contact">
                <Search className="w-4 h-4" />
                Help! IT Support
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Button asChild variant="outline" size="sm" className="h-10 border-workflo-yellow/30 hover:bg-workflo-yellow/5 hover:border-workflo-yellow/60 transition-all duration-200">
              <Link href="/diensten">
                Onze Diensten
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="sm" className="h-10 border-workflo-yellow/30 hover:bg-workflo-yellow/5 hover:border-workflo-yellow/60 transition-all duration-200">
              <Link href="/over-ons">
                Over Workflo
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="sm" className="h-10 border-workflo-yellow/30 hover:bg-workflo-yellow/5 hover:border-workflo-yellow/60 transition-all duration-200">
              <Link href="/prijzen">
                Prijzen
              </Link>
            </Button>
          </div>
        </div>

        {/* IT Humor Footer */}
        <div className="bg-muted/30 rounded-lg p-6 space-y-3">
          <div className="flex items-center justify-center gap-2 text-lg">
            <WifiOff className="w-5 h-5 text-muted-foreground" />
            <span className="font-medium">Ondertussen bij Workflo...</span>
          </div>
          
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>🔧 <strong>Ontwikkelaar:</strong> "Het werkte op mijn machine..."</p>
            <p>🖥️ <strong>Systeembeheerder:</strong> "Hebben we de server al opnieuw opgestart?"</p>
            <p>☕ <strong>IT Manager:</strong> "Tijd voor meer koffie, team!"</p>
          </div>
          
          <div className="border-t pt-3 mt-3">
            <p className="text-xs text-muted-foreground">
              Als deze pagina een echte server was, hadden wij hem al gerepareerd. 
              <br />
              <strong>Workflo</strong> - Waar IT-problemen verdwijnen (net als deze pagina) ✨
            </p>
          </div>
        </div>

        {/* Emergency Contact */}
        <Card className="border-workflo-yellow/30 bg-workflo-yellow/5">
          <CardContent className="pt-6">
            <p className="text-sm text-foreground">
              <strong>Noodcontact voor echte IT-emergencies:</strong>
              <br />
              📞 <a href="tel:+31203080465" className="text-foreground hover:text-workflo-yellow hover:underline font-medium transition-colors">020-30 80 465</a>
              <br />
              📧 <a href="mailto:info@workflo.it" className="text-foreground hover:text-workflo-yellow hover:underline font-medium transition-colors">info@workflo.it</a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}