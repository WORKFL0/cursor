'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command';
import {
  Search,
  FileText,
  Settings,
  Home,
  User,
  Mail,
  Phone,
  HelpCircle,
  Package,
  Shield,
  Cloud,
  Cpu,
  Globe,
  Zap,
  Briefcase,
  ChevronRight,
  History,
  Sparkles,
  ArrowRight,
  MessageSquare,
  Calendar,
  Star,
  Code,
  Database,
  Lock,
  Smartphone,
  Monitor,
  Wifi,
  Server
} from 'lucide-react';
import Fuse from 'fuse.js';
import { Badge } from '@/components/ui/badge';

interface CommandItem {
  id: string;
  title: string;
  description?: string;
  icon: React.ElementType;
  category: 'navigation' | 'service' | 'action' | 'help' | 'ai';
  href?: string;
  action?: () => void;
  keywords?: string[];
  shortcut?: string;
  badge?: string;
}

const commandItems: CommandItem[] = [
  // Navigation
  { 
    id: 'home', 
    title: 'Home', 
    description: 'Ga naar de homepage',
    icon: Home, 
    category: 'navigation', 
    href: '/',
    keywords: ['home', 'start', 'begin'],
    shortcut: 'G H'
  },
  { 
    id: 'diensten', 
    title: 'Diensten', 
    description: 'Bekijk onze IT diensten',
    icon: Package, 
    category: 'navigation', 
    href: '/diensten',
    keywords: ['services', 'aanbod', 'producten'],
    shortcut: 'G D'
  },
  { 
    id: 'over-ons', 
    title: 'Over Ons', 
    description: 'Leer ons team kennen',
    icon: User, 
    category: 'navigation', 
    href: '/over-ons',
    keywords: ['about', 'team', 'bedrijf'],
    shortcut: 'G O'
  },
  { 
    id: 'contact', 
    title: 'Contact', 
    description: 'Neem contact met ons op',
    icon: Mail, 
    category: 'navigation', 
    href: '/contact',
    keywords: ['contact', 'email', 'bereik'],
    shortcut: 'G C'
  },
  
  // Services
  { 
    id: 'it-beheer', 
    title: 'IT Beheer', 
    description: 'Volledige IT infrastructuur beheer',
    icon: Shield, 
    category: 'service', 
    href: '/diensten/it-beheer',
    keywords: ['management', 'beheer', 'onderhoud'],
    badge: 'Populair'
  },
  { 
    id: 'cloud', 
    title: 'Cloud Diensten', 
    description: 'Cloud migratie en beheer',
    icon: Cloud, 
    category: 'service', 
    href: '/diensten/cloud',
    keywords: ['cloud', 'azure', 'aws', 'hosting']
  },
  { 
    id: 'cybersecurity', 
    title: 'Cybersecurity', 
    description: 'Bescherm uw bedrijf tegen cyberdreigingen',
    icon: Lock, 
    category: 'service', 
    href: '/diensten/cybersecurity',
    keywords: ['security', 'beveiliging', 'veiligheid', 'cyber'],
    badge: 'Belangrijk'
  },
  { 
    id: 'hardware', 
    title: 'Hardware', 
    description: 'Hardware onderhoud en installatie',
    icon: Cpu, 
    category: 'service', 
    href: '/diensten/hardware',
    keywords: ['hardware', 'computers', 'apparatuur']
  },
  { 
    id: 'software', 
    title: 'Software Ontwikkeling', 
    description: 'Custom software oplossingen',
    icon: Code, 
    category: 'service', 
    href: '/diensten/software',
    keywords: ['software', 'programmeren', 'ontwikkeling', 'apps']
  },
  { 
    id: 'netwerk', 
    title: 'Netwerk Infrastructuur', 
    description: 'Netwerk ontwerp en implementatie',
    icon: Wifi, 
    category: 'service', 
    href: '/diensten/netwerk',
    keywords: ['netwerk', 'network', 'wifi', 'lan', 'wan']
  },
  { 
    id: 'voip', 
    title: 'VoIP Telefonie', 
    description: 'Moderne telefonie oplossingen',
    icon: Phone, 
    category: 'service', 
    href: '/diensten/voip',
    keywords: ['telefoon', 'voip', 'telefonie', 'communicatie']
  },
  { 
    id: 'backup', 
    title: 'Backup & Recovery', 
    description: 'Data backup en disaster recovery',
    icon: Database, 
    category: 'service', 
    href: '/diensten/backup',
    keywords: ['backup', 'recovery', 'herstel', 'data']
  },
  { 
    id: 'consultancy', 
    title: 'IT Consultancy', 
    description: 'Strategisch IT advies',
    icon: Briefcase, 
    category: 'service', 
    href: '/diensten/consultancy',
    keywords: ['advies', 'consultancy', 'strategie']
  },
  { 
    id: 'werkplek', 
    title: 'Moderne Werkplek', 
    description: 'Microsoft 365 en moderne werkplekken',
    icon: Monitor, 
    category: 'service', 
    href: '/diensten/moderne-werkplek',
    keywords: ['werkplek', 'microsoft', '365', 'office']
  },
  { 
    id: 'server-beheer', 
    title: 'Server Beheer', 
    description: 'Server onderhoud en monitoring',
    icon: Server, 
    category: 'service', 
    href: '/diensten/server-beheer',
    keywords: ['server', 'datacenter', 'hosting']
  },
  { 
    id: 'mobility', 
    title: 'Mobility Solutions', 
    description: 'Mobile device management',
    icon: Smartphone, 
    category: 'service', 
    href: '/diensten/mobility',
    keywords: ['mobiel', 'mobile', 'mdm', 'byod']
  },
  
  // Actions
  { 
    id: 'chat', 
    title: 'Open AI Chat', 
    description: 'Chat met onze AI assistent',
    icon: MessageSquare, 
    category: 'ai',
    action: () => {
      const event = new CustomEvent('openAIChat');
      window.dispatchEvent(event);
    },
    keywords: ['chat', 'ai', 'help', 'assistent', 'bot'],
    shortcut: '⌘ /',
    badge: 'AI'
  },
  { 
    id: 'offerte', 
    title: 'Offerte Aanvragen', 
    description: 'Vraag een vrijblijvende offerte aan',
    icon: FileText, 
    category: 'action',
    href: '/offerte',
    keywords: ['offerte', 'quote', 'prijs', 'aanvraag'],
    badge: 'Nieuw'
  },
  { 
    id: 'afspraak', 
    title: 'Afspraak Maken', 
    description: 'Plan een gesprek met onze experts',
    icon: Calendar, 
    category: 'action',
    href: '/contact#afspraak',
    keywords: ['afspraak', 'meeting', 'gesprek', 'consultatie']
  },
  { 
    id: 'support', 
    title: 'Support Ticket', 
    description: 'Open een support ticket',
    icon: HelpCircle, 
    category: 'action',
    href: 'https://servicedesk.workflo.it',
    keywords: ['support', 'help', 'ticket', 'probleem']
  },
  
  // Help
  { 
    id: 'faq', 
    title: 'Veelgestelde Vragen', 
    description: 'Bekijk FAQ',
    icon: HelpCircle, 
    category: 'help',
    href: '/faq',
    keywords: ['faq', 'vragen', 'help', 'uitleg']
  },
  { 
    id: 'docs', 
    title: 'Documentatie', 
    description: 'Technische documentatie',
    icon: FileText, 
    category: 'help',
    href: '/docs',
    keywords: ['docs', 'documentatie', 'handleiding', 'manual']
  },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const router = useRouter();

  // Load recent searches from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('recentSearches');
    if (stored) {
      setRecentSearches(JSON.parse(stored));
    }
  }, []);

  // Setup keyboard shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || 
          (e.key === '/' && (e.metaKey || e.ctrlKey))) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  // Setup Fuse.js for fuzzy search
  const fuse = useMemo(
    () =>
      new Fuse(commandItems, {
        keys: ['title', 'description', 'keywords'],
        threshold: 0.3,
        includeScore: true,
      }),
    []
  );

  const filteredItems = useMemo(() => {
    if (!search) return commandItems;
    return fuse.search(search).map((result) => result.item);
  }, [search, fuse]);

  const handleSelect = useCallback((item: CommandItem) => {
    // Save to recent searches
    const newRecent = [item.title, ...recentSearches.filter(s => s !== item.title)].slice(0, 5);
    setRecentSearches(newRecent);
    localStorage.setItem('recentSearches', JSON.stringify(newRecent));

    if (item.action) {
      item.action();
    } else if (item.href) {
      if (item.href.startsWith('http')) {
        window.open(item.href, '_blank');
      } else {
        router.push(item.href);
      }
    }
    setOpen(false);
    setSearch('');
  }, [router, recentSearches]);

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'navigation': return 'Navigatie';
      case 'service': return 'Diensten';
      case 'action': return 'Acties';
      case 'help': return 'Help';
      case 'ai': return 'AI Features';
      default: return category;
    }
  };

  const groupedItems = useMemo(() => {
    const groups: Record<string, CommandItem[]> = {};
    filteredItems.forEach((item) => {
      if (!groups[item.category]) {
        groups[item.category] = [];
      }
      groups[item.category].push(item);
    });
    return groups;
  }, [filteredItems]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="hidden md:flex items-center gap-2 px-3 py-1.5 text-sm text-gray-500 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg transition-colors"
      >
        <Search className="h-4 w-4" />
        <span>Zoeken...</span>
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput 
          placeholder="Zoek diensten, navigatie, of acties..." 
          value={search}
          onValueChange={setSearch}
        />
        <CommandList>
          <CommandEmpty>
            <div className="text-center py-6">
              <p className="text-sm text-gray-500">Geen resultaten gevonden</p>
              <p className="text-xs text-gray-400 mt-2">Probeer andere zoektermen</p>
            </div>
          </CommandEmpty>

          {recentSearches.length > 0 && !search && (
            <>
              <CommandGroup heading="Recent">
                {recentSearches.map((recent) => {
                  const item = commandItems.find(i => i.title === recent);
                  if (!item) return null;
                  return (
                    <CommandItem
                      key={`recent-${item.id}`}
                      onSelect={() => handleSelect(item)}
                      className="flex items-center gap-2"
                    >
                      <History className="h-4 w-4 text-gray-400" />
                      <span>{item.title}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
              <CommandSeparator />
            </>
          )}

          {Object.entries(groupedItems).map(([category, items]) => (
            <CommandGroup key={category} heading={getCategoryLabel(category)}>
              {items.map((item) => {
                const Icon = item.icon;
                return (
                  <CommandItem
                    key={item.id}
                    onSelect={() => handleSelect(item)}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-4 w-4 text-gray-500" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span>{item.title}</span>
                          {item.badge && (
                            <Badge variant={
                              item.badge === 'AI' ? 'default' : 
                              item.badge === 'Belangrijk' ? 'destructive' :
                              item.badge === 'Populair' ? 'secondary' :
                              'outline'
                            } className="text-xs">
                              {item.badge === 'AI' && <Sparkles className="h-3 w-3 mr-1" />}
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                        {item.description && (
                          <p className="text-xs text-gray-500">{item.description}</p>
                        )}
                      </div>
                    </div>
                    {item.shortcut && (
                      <CommandShortcut>{item.shortcut}</CommandShortcut>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          ))}
        </CommandList>
        
        <div className="border-t p-2 text-xs text-gray-500 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs">↑↓</kbd>
              Navigeer
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs">↵</kbd>
              Selecteer
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs">ESC</kbd>
              Sluit
            </span>
          </div>
          <span className="flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            AI-powered search
          </span>
        </div>
      </CommandDialog>
    </>
  );
}