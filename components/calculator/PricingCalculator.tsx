'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from '@/lib/framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Calculator,
  Users,
  Server,
  Shield,
  Clock,
  TrendingDown,
  CheckCircle,
  XCircle,
  Star,
  Zap,
  Target,
  FileText,
  Download,
  Send,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Award,
  Euro,
  Sparkles,
} from 'lucide-react'
import {
  calculateAdhocPricing,
  calculatePrepaidPricing,
  calculateManagedPricing,
  calculateSavings,
  calculateROI,
  type SupportModel,
  type SecurityLevel,
  type SLALevel,
} from '@/config/pricing'

// Step indicator component
function StepIndicator({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div key={index} className="flex items-center flex-1">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                currentStep > index
                  ? 'bg-primary text-primary-foreground'
                  : currentStep === index
                  ? 'bg-primary/20 text-primary ring-2 ring-primary'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {currentStep > index ? <CheckCircle className="w-5 h-5" /> : index + 1}
            </div>
            {index < totalSteps - 1 && (
              <div
                className={`flex-1 h-1 mx-2 rounded-full transition-all ${
                  currentStep > index ? 'bg-primary' : 'bg-muted'
                }`}
              />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Model</span>
        <span>Parameters</span>
        <span>Results</span>
        <span>Comparison</span>
      </div>
    </div>
  )
}

// Format currency
function formatEuro(amount: number): string {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export default function PricingCalculator() {
  // Step state
  const [currentStep, setCurrentStep] = useState(0)

  // Model selection
  const [selectedModel, setSelectedModel] = useState<SupportModel>('managed')

  // Input parameters
  const [employees, setEmployees] = useState(10)
  const [workstations, setWorkstations] = useState(10)
  const [servers, setServers] = useState(2)
  const [remoteWorkers, setRemoteWorkers] = useState(0)
  const [securityLevel, setSecurityLevel] = useState<SecurityLevel>('medium')
  const [slaLevel, setSlaLevel] = useState<SLALevel>('4h')
  const [supportType, setSupportType] = useState<'remote' | 'onsite'>('remote')
  const [commitmentType, setCommitmentType] = useState<'monthly' | 'yearly'>('monthly')

  // Calculate all pricing models
  const adhocPricing = useMemo(
    () => calculateAdhocPricing({ employees, servers }),
    [employees, servers]
  )

  const prepaidPricing = useMemo(
    () => calculatePrepaidPricing({ employees, servers }),
    [employees, servers]
  )

  const managedPricing = useMemo(
    () =>
      calculateManagedPricing({
        employees,
        workstations,
        servers,
        remoteWorkers,
        securityLevel,
        slaLevel,
        supportType,
        commitmentType,
      }),
    [employees, workstations, servers, remoteWorkers, securityLevel, slaLevel, supportType, commitmentType]
  )

  const savings = useMemo(
    () => calculateSavings(managedPricing.monthlyTotal, adhocPricing.monthlyTotal),
    [managedPricing.monthlyTotal, adhocPricing.monthlyTotal]
  )

  const roi = useMemo(
    () =>
      calculateROI({
        employees,
        servers,
        securityLevel,
        slaLevel,
        supportType,
      }),
    [employees, servers, securityLevel, slaLevel, supportType]
  )

  // Navigation
  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1)
  }

  const goToStep = (step: number) => {
    setCurrentStep(step)
  }

  // STEP 1: Model Selection
  const Step1ModelSelection = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-3">Kies je support model</h2>
        <p className="text-muted-foreground text-lg">
          Vergelijk verschillende IT support modellen en vind de beste optie voor jouw bedrijf
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Ad-hoc Support Card */}
        <Card
          className={`cursor-pointer transition-all hover:shadow-lg ${
            selectedModel === 'adhoc' ? 'ring-2 ring-primary' : ''
          }`}
          onClick={() => setSelectedModel('adhoc')}
        >
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-xl">Ad-hoc Support</CardTitle>
              {selectedModel === 'adhoc' && (
                <CheckCircle className="w-6 h-6 text-primary" />
              )}
            </div>
            <CardDescription>Betaal per incident</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-3xl font-bold">€110<span className="text-lg text-muted-foreground">/uur</span></div>

            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                <span className="text-sm">Geen commitment</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                <span className="text-sm">Betaal alleen wat je gebruikt</span>
              </li>
              <li className="flex items-start gap-2">
                <XCircle className="w-4 h-4 text-red-600 mt-1 flex-shrink-0" />
                <span className="text-sm">Onvoorspelbare kosten</span>
              </li>
              <li className="flex items-start gap-2">
                <XCircle className="w-4 h-4 text-red-600 mt-1 flex-shrink-0" />
                <span className="text-sm">Geen proactieve monitoring</span>
              </li>
            </ul>

            <Badge variant="outline" className="w-full justify-center">
              Voor incidenteel gebruik
            </Badge>
          </CardContent>
        </Card>

        {/* Prepaid Strippenkaart Card */}
        <Card
          className={`cursor-pointer transition-all hover:shadow-lg ${
            selectedModel === 'prepaid' ? 'ring-2 ring-primary' : ''
          }`}
          onClick={() => setSelectedModel('prepaid')}
        >
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-xl">Prepaid Strippenkaart</CardTitle>
              {selectedModel === 'prepaid' && (
                <CheckCircle className="w-6 h-6 text-primary" />
              )}
            </div>
            <CardDescription>Vooruitbetalen met korting</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-3xl font-bold">€1.800<span className="text-lg text-muted-foreground">/20 uur</span></div>

            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                <span className="text-sm">18% goedkoper dan ad-hoc</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                <span className="text-sm">3 maanden geldig</span>
              </li>
              <li className="flex items-start gap-2">
                <XCircle className="w-4 h-4 text-red-600 mt-1 flex-shrink-0" />
                <span className="text-sm">Uren kunnen verlopen</span>
              </li>
              <li className="flex items-start gap-2">
                <XCircle className="w-4 h-4 text-red-600 mt-1 flex-shrink-0" />
                <span className="text-sm">Nog steeds reactief</span>
              </li>
            </ul>

            <Badge variant="outline" className="w-full justify-center">
              Voor regelmatig gebruik
            </Badge>
          </CardContent>
        </Card>

        {/* Managed IT Card (Recommended) */}
        <Card
          className={`cursor-pointer transition-all hover:shadow-lg relative overflow-hidden ${
            selectedModel === 'managed' ? 'ring-2 ring-primary' : ''
          }`}
          onClick={() => setSelectedModel('managed')}
        >
          <div className="absolute top-0 right-0">
            <Badge className="bg-primary text-primary-foreground rounded-none rounded-bl-lg">
              <Star className="w-3 h-3 mr-1" />
              Aanbevolen
            </Badge>
          </div>
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-xl">Managed IT</CardTitle>
              {selectedModel === 'managed' && (
                <CheckCircle className="w-6 h-6 text-primary" />
              )}
            </div>
            <CardDescription>Vaste maandprijs - All-inclusive</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <div className="text-3xl font-bold">Vanaf €60<span className="text-lg text-muted-foreground">/gebruiker/mnd</span></div>
              <div className="text-sm text-green-600 font-semibold">✓ 35% goedkoper dan ad-hoc</div>
            </div>

            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                <span className="text-sm">Voorspelbare vaste kosten</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                <span className="text-sm">24/7 proactieve monitoring</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                <span className="text-sm">Onbeperkte support tickets</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                <span className="text-sm">Strategisch IT advies</span>
              </li>
            </ul>

            <Badge className="w-full justify-center bg-primary text-primary-foreground">
              Beste waarde - 35% goedkoper
            </Badge>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end mt-8">
        <Button onClick={nextStep} size="lg" className="gap-2">
          Volgende: Voer parameters in
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  )

  // STEP 2: Input Parameters
  const Step2Parameters = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-3">Configureer je IT omgeving</h2>
        <p className="text-muted-foreground text-lg">
          Pas de parameters aan voor een nauwkeurige prijsberekening
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Organisatie grootte
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Employees */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label className="text-base font-semibold">Aantal medewerkers</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={employees}
                  onChange={(e) => setEmployees(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 text-center"
                  min={1}
                  max={200}
                />
                <Users className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
            <Slider
              value={[employees]}
              onValueChange={(value) => setEmployees(value[0])}
              max={200}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1</span>
              <span>50</span>
              <span>100</span>
              <span>200</span>
            </div>
          </div>

          {/* Workstations */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label className="text-base font-semibold">Aantal werkstations</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={workstations}
                  onChange={(e) => setWorkstations(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-20 text-center"
                  min={0}
                  max={200}
                />
              </div>
            </div>
            <Slider
              value={[workstations]}
              onValueChange={(value) => setWorkstations(value[0])}
              max={200}
              min={0}
              step={1}
              className="w-full"
            />
          </div>

          {/* Servers */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label className="text-base font-semibold">Aantal servers (optioneel)</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={servers}
                  onChange={(e) => setServers(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-20 text-center"
                  min={0}
                  max={20}
                />
                <Server className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
            <Slider
              value={[servers]}
              onValueChange={(value) => setServers(value[0])}
              max={20}
              min={0}
              step={1}
              className="w-full"
            />
          </div>

          {/* Remote Workers */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label className="text-base font-semibold">Thuiswerkers</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={remoteWorkers}
                  onChange={(e) => setRemoteWorkers(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-20 text-center"
                  min={0}
                  max={employees}
                />
              </div>
            </div>
            <Slider
              value={[remoteWorkers]}
              onValueChange={(value) => setRemoteWorkers(value[0])}
              max={employees}
              min={0}
              step={1}
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Security & SLA
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Security Level */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Security niveau</Label>
            <div className="grid grid-cols-3 gap-3">
              {(['low', 'medium', 'high'] as SecurityLevel[]).map((level) => (
                <Card
                  key={level}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    securityLevel === level ? 'ring-2 ring-primary bg-primary/5' : ''
                  }`}
                  onClick={() => setSecurityLevel(level)}
                >
                  <CardContent className="p-4 text-center">
                    <div className="font-semibold mb-1 capitalize">
                      {level === 'low' ? 'Basis' : level === 'medium' ? 'Medium' : 'Hoog'}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {level === 'low' ? 'Antivirus + Firewall' : level === 'medium' ? 'EDR + MFA' : 'XDR + SOC'}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* SLA Level */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">SLA niveau</Label>
            <div className="grid grid-cols-3 gap-3">
              {(['4h', '2h', '1h'] as SLALevel[]).map((level) => (
                <Card
                  key={level}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    slaLevel === level ? 'ring-2 ring-primary bg-primary/5' : ''
                  }`}
                  onClick={() => setSlaLevel(level)}
                >
                  <CardContent className="p-4 text-center">
                    <Clock className="w-6 h-6 mx-auto mb-2 text-primary" />
                    <div className="font-semibold mb-1">{level} response</div>
                    <div className="text-xs text-muted-foreground">
                      {level === '4h' ? 'Kantooruren' : level === '2h' ? '24/7' : '24/7 + dedicated'}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Support Type */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Support type</Label>
            <div className="grid grid-cols-2 gap-3">
              <Card
                className={`cursor-pointer transition-all hover:shadow-md ${
                  supportType === 'remote' ? 'ring-2 ring-primary bg-primary/5' : ''
                }`}
                onClick={() => setSupportType('remote')}
              >
                <CardContent className="p-4 text-center">
                  <Zap className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <div className="font-semibold mb-1">Remote</div>
                  <div className="text-xs text-muted-foreground">€60/gebruiker</div>
                </CardContent>
              </Card>
              <Card
                className={`cursor-pointer transition-all hover:shadow-md ${
                  supportType === 'onsite' ? 'ring-2 ring-primary bg-primary/5' : ''
                }`}
                onClick={() => setSupportType('onsite')}
              >
                <CardContent className="p-4 text-center">
                  <Target className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <div className="font-semibold mb-1">Onsite</div>
                  <div className="text-xs text-muted-foreground">€90/gebruiker</div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Commitment Type */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Contract type</Label>
            <div className="grid grid-cols-2 gap-3">
              <Card
                className={`cursor-pointer transition-all hover:shadow-md ${
                  commitmentType === 'monthly' ? 'ring-2 ring-primary bg-primary/5' : ''
                }`}
                onClick={() => setCommitmentType('monthly')}
              >
                <CardContent className="p-4 text-center">
                  <div className="font-semibold mb-1">Maandelijks</div>
                  <div className="text-xs text-muted-foreground">Opzegbaar</div>
                </CardContent>
              </Card>
              <Card
                className={`cursor-pointer transition-all hover:shadow-md ${
                  commitmentType === 'yearly' ? 'ring-2 ring-primary bg-primary/5' : ''
                }`}
                onClick={() => setCommitmentType('yearly')}
              >
                <CardContent className="p-4 text-center">
                  <div className="font-semibold mb-1">Jaarlijks</div>
                  <div className="text-xs text-muted-foreground">10% korting</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between mt-8">
        <Button onClick={prevStep} variant="outline" size="lg" className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Vorige
        </Button>
        <Button onClick={nextStep} size="lg" className="gap-2">
          Bekijk resultaten
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  )

  // STEP 3: Results
  const Step3Results = () => {
    const selectedPricing =
      selectedModel === 'adhoc'
        ? adhocPricing
        : selectedModel === 'prepaid'
        ? prepaidPricing
        : managedPricing

    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="space-y-8"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-3">Je prijsberekening</h2>
          <p className="text-muted-foreground text-lg">
            Transparant overzicht van je maandelijkse IT kosten
          </p>
        </div>

        {/* Monthly Cost Card */}
        <Card className="border-primary/50 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center justify-between">
              <span>Maandelijkse kosten</span>
              <Badge variant="outline" className="text-lg px-4 py-2">
                {selectedModel === 'adhoc' ? 'Ad-hoc' : selectedModel === 'prepaid' ? 'Prepaid' : 'Managed IT'}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold text-primary mb-4">
              {formatEuro(selectedPricing.monthlyTotal)}
              <span className="text-2xl text-muted-foreground font-normal">/maand</span>
            </div>
            <div className="text-lg text-muted-foreground">
              Jaarlijks: {formatEuro(selectedPricing.yearlyTotal)}
            </div>
          </CardContent>
        </Card>

        {/* Breakdown Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Kostenverdeling
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {selectedModel === 'managed' && (
              <>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-muted-foreground">Support ({employees} medewerkers)</span>
                  <span className="font-semibold">{formatEuro((managedPricing.breakdown as any).employeeCost)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-muted-foreground">Servers ({servers}x)</span>
                  <span className="font-semibold">{formatEuro((managedPricing.breakdown as any).serverCost)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-muted-foreground">Security ({securityLevel})</span>
                  <span className="font-semibold">{formatEuro((managedPricing.breakdown as any).securityCost)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-muted-foreground">SLA multiplier ({slaLevel})</span>
                  <span className="font-semibold">{((managedPricing.breakdown as any).slaMultiplier * 100 - 100).toFixed(0)}%</span>
                </div>
                {(managedPricing.breakdown as any).volumeDiscount > 0 && (
                  <div className="flex justify-between items-center py-2 border-b text-green-600">
                    <span>Volume korting</span>
                    <span className="font-semibold">-{((managedPricing.breakdown as any).volumeDiscount * 100).toFixed(0)}%</span>
                  </div>
                )}
                {commitmentType === 'yearly' && (
                  <div className="flex justify-between items-center py-2 border-b text-green-600">
                    <span>Jaarcontract korting</span>
                    <span className="font-semibold">-10%</span>
                  </div>
                )}
              </>
            )}

            {selectedModel === 'adhoc' && (
              <>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-muted-foreground">Reguliere uren (~{(adhocPricing as any).estimatedHours}h)</span>
                  <span className="font-semibold">{formatEuro((adhocPricing as any).breakdown.regularHours)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-muted-foreground">Na kantooruren (schatting)</span>
                  <span className="font-semibold">{formatEuro((adhocPricing as any).breakdown.afterHours)}</span>
                </div>
              </>
            )}

            {selectedModel === 'prepaid' && (
              <>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-muted-foreground">Pakketten ({(prepaidPricing as any).packagesNeeded}x 20 uur)</span>
                  <span className="font-semibold">{formatEuro((prepaidPricing as any).breakdown.totalPackages * 1800)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-muted-foreground">Totaal uren inbegrepen</span>
                  <span className="font-semibold">{(prepaidPricing as any).hoursIncluded}h</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Savings Card (for Managed IT) */}
        {selectedModel === 'managed' && savings.monthly > 0 && (
          <Card className="border-green-500/50 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
                <TrendingDown className="w-5 h-5" />
                Je bespaart
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-green-700 dark:text-green-300 mb-2">
                {formatEuro(savings.monthly)}
                <span className="text-xl font-normal">/maand</span>
              </div>
              <div className="text-lg text-green-600 dark:text-green-400 mb-4">
                = {formatEuro(savings.yearly)} per jaar
              </div>
              <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                <Award className="w-5 h-5" />
                <span className="font-semibold">{savings.percentage}% goedkoper dan ad-hoc support</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ROI Card */}
        {selectedModel === 'managed' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Return on Investment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-primary/5 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{formatEuro(roi.yearlySavings)}</div>
                  <div className="text-sm text-muted-foreground">Jaarlijkse besparing</div>
                </div>
                <div className="text-center p-4 bg-primary/5 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{formatEuro(roi.threeYearSavings)}</div>
                  <div className="text-sm text-muted-foreground">3-jaar besparing</div>
                </div>
                <div className="text-center p-4 bg-primary/5 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{formatEuro(roi.fiveYearSavings)}</div>
                  <div className="text-sm text-muted-foreground">5-jaar besparing</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* What's Included */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              Inbegrepen services
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-3">
              {selectedPricing.features?.slice(0, 10).map((feature, index) => (
                <div key={index} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* CTAs */}
        <div className="grid md:grid-cols-2 gap-4">
          <Button size="lg" className="w-full gap-2">
            <Send className="w-4 h-4" />
            Plan gratis consult
          </Button>
          <Button size="lg" variant="outline" className="w-full gap-2">
            <Download className="w-4 h-4" />
            Download PDF rapport
          </Button>
        </div>

        <div className="flex justify-between mt-8">
          <Button onClick={prevStep} variant="outline" size="lg" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Vorige
          </Button>
          <Button onClick={nextStep} size="lg" className="gap-2">
            Vergelijk modellen
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>
    )
  }

  // STEP 4: Comparison Table
  const Step4Comparison = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-3">Model vergelijking</h2>
        <p className="text-muted-foreground text-lg">
          Zie in één oogopslag de verschillen tussen de support modellen
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-primary">
              <th className="text-left p-4 font-semibold">Feature</th>
              <th className="text-center p-4 font-semibold">Ad-hoc</th>
              <th className="text-center p-4 font-semibold">Prepaid</th>
              <th className="text-center p-4 font-semibold bg-primary/5">
                <Badge className="mb-2">Aanbevolen</Badge>
                <div>Managed IT</div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="p-4 font-medium">Maandelijkse kosten</td>
              <td className="text-center p-4">{formatEuro(adhocPricing.monthlyTotal)}</td>
              <td className="text-center p-4">{formatEuro(prepaidPricing.monthlyTotal)}</td>
              <td className="text-center p-4 bg-primary/5 font-bold text-primary">
                {formatEuro(managedPricing.monthlyTotal)}
              </td>
            </tr>
            <tr className="border-b">
              <td className="p-4 font-medium">Jaarlijkse kosten</td>
              <td className="text-center p-4">{formatEuro(adhocPricing.yearlyTotal)}</td>
              <td className="text-center p-4">{formatEuro(prepaidPricing.yearlyTotal)}</td>
              <td className="text-center p-4 bg-primary/5 font-bold text-primary">
                {formatEuro(managedPricing.yearlyTotal)}
              </td>
            </tr>
            <tr className="border-b bg-green-50 dark:bg-green-950">
              <td className="p-4 font-medium">Besparing vs Ad-hoc</td>
              <td className="text-center p-4">-</td>
              <td className="text-center p-4 text-green-600 font-semibold">
                {formatEuro(adhocPricing.monthlyTotal - prepaidPricing.monthlyTotal)}/mnd
              </td>
              <td className="text-center p-4 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 font-bold">
                {formatEuro(savings.monthly)}/mnd ({savings.percentage}%)
              </td>
            </tr>
            <tr className="border-b">
              <td className="p-4 font-medium">Voorspelbaarheid</td>
              <td className="text-center p-4">
                <XCircle className="w-5 h-5 text-red-600 mx-auto" />
              </td>
              <td className="text-center p-4">
                <AlertCircle className="w-5 h-5 text-yellow-600 mx-auto" />
              </td>
              <td className="text-center p-4 bg-primary/5">
                <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
              </td>
            </tr>
            <tr className="border-b">
              <td className="p-4 font-medium">Proactieve monitoring</td>
              <td className="text-center p-4">
                <XCircle className="w-5 h-5 text-red-600 mx-auto" />
              </td>
              <td className="text-center p-4">
                <XCircle className="w-5 h-5 text-red-600 mx-auto" />
              </td>
              <td className="text-center p-4 bg-primary/5">
                <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
              </td>
            </tr>
            <tr className="border-b">
              <td className="p-4 font-medium">24/7 Support</td>
              <td className="text-center p-4">
                <XCircle className="w-5 h-5 text-red-600 mx-auto" />
              </td>
              <td className="text-center p-4">
                <XCircle className="w-5 h-5 text-red-600 mx-auto" />
              </td>
              <td className="text-center p-4 bg-primary/5">
                <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
              </td>
            </tr>
            <tr className="border-b">
              <td className="p-4 font-medium">Strategisch IT advies</td>
              <td className="text-center p-4">
                <XCircle className="w-5 h-5 text-red-600 mx-auto" />
              </td>
              <td className="text-center p-4">
                <XCircle className="w-5 h-5 text-red-600 mx-auto" />
              </td>
              <td className="text-center p-4 bg-primary/5">
                <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
              </td>
            </tr>
            <tr className="border-b">
              <td className="p-4 font-medium">Onbeperkte tickets</td>
              <td className="text-center p-4">
                <XCircle className="w-5 h-5 text-red-600 mx-auto" />
              </td>
              <td className="text-center p-4">Beperkt tot uren</td>
              <td className="text-center p-4 bg-primary/5">
                <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
              </td>
            </tr>
            <tr className="border-b">
              <td className="p-4 font-medium">SLA garantie</td>
              <td className="text-center p-4">Nee</td>
              <td className="text-center p-4">Nee</td>
              <td className="text-center p-4 bg-primary/5 font-semibold">{slaLevel}</td>
            </tr>
            <tr className="border-b">
              <td className="p-4 font-medium">Security niveau</td>
              <td className="text-center p-4">Basis</td>
              <td className="text-center p-4">Basis</td>
              <td className="text-center p-4 bg-primary/5 font-semibold capitalize">{securityLevel}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Final CTA */}
      <Card className="border-primary bg-gradient-to-br from-primary/5 to-primary/10">
        <CardContent className="p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Klaar om te besparen?</h3>
          <p className="text-muted-foreground mb-6 text-lg">
            Plan een gratis consult en ontdek hoe Managed IT jouw bedrijf kan helpen
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="gap-2">
              <Send className="w-4 h-4" />
              Plan gratis consult
            </Button>
            <Button size="lg" variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Download PDF rapport
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between mt-8">
        <Button onClick={prevStep} variant="outline" size="lg" className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Vorige
        </Button>
        <Button onClick={() => goToStep(0)} variant="outline" size="lg" className="gap-2">
          Start opnieuw
          <Calculator className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  )

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      <StepIndicator currentStep={currentStep} totalSteps={4} />

      <AnimatePresence mode="wait">
        {currentStep === 0 && <Step1ModelSelection key="step1" />}
        {currentStep === 1 && <Step2Parameters key="step2" />}
        {currentStep === 2 && <Step3Results key="step3" />}
        {currentStep === 3 && <Step4Comparison key="step4" />}
      </AnimatePresence>
    </div>
  )
}
