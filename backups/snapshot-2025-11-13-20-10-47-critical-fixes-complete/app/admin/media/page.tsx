'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { 
  Upload, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Download, 
  Trash2, 
  Copy,
  Image as ImageIcon,
  File,
  Video,
  FileText,
  AlertCircle,
  FolderOpen,
  Grid3X3,
  List
} from 'lucide-react'

interface MediaFile {
  id: string
  filename: string
  url: string
  size: number
  type: string
  mimetype: string
  uploaded_at: string
  uploaded_by: string
}

const formatFileSize = (bytes: number) => {
  const units = ['B', 'KB', 'MB', 'GB']
  let size = bytes
  let unitIndex = 0
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }
  
  return `${size.toFixed(1)} ${units[unitIndex]}`
}

const getFileIcon = (mimetype: string) => {
  if (mimetype.startsWith('image/')) return ImageIcon
  if (mimetype.startsWith('video/')) return Video
  if (mimetype.startsWith('text/') || mimetype.includes('document')) return FileText
  return File
}

export default function MediaLibraryPage() {
  const [files, setFiles] = useState<MediaFile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFileType, setSelectedFileType] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Mock data - in real implementation, this would come from the API
  const mockFiles: MediaFile[] = [
    {
      id: '1',
      filename: 'hero-image.jpg',
      url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800',
      size: 245760,
      type: 'image',
      mimetype: 'image/jpeg',
      uploaded_at: '2024-01-15T10:30:00Z',
      uploaded_by: 'admin@workflo.it'
    },
    {
      id: '2', 
      filename: 'company-logo.png',
      url: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400',
      size: 128000,
      type: 'image',
      mimetype: 'image/png',
      uploaded_at: '2024-01-10T14:20:00Z',
      uploaded_by: 'admin@workflo.it'
    },
    {
      id: '3',
      filename: 'presentation.pdf',
      url: '#',
      size: 1024000,
      type: 'document',
      mimetype: 'application/pdf',
      uploaded_at: '2024-01-08T09:15:00Z',
      uploaded_by: 'admin@workflo.it'
    }
  ]

  // Fetch media files
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        // For demo purposes, we'll use mock data
        // In real implementation, this would be:
        // const token = localStorage.getItem('admin_token')
        // const response = await fetch('/api/v1/media', { headers: { 'Authorization': `Bearer ${token}` } })
        
        setFiles(mockFiles)
      } catch (error) {
        console.error('Failed to fetch media files:', error)
        setError('Failed to load media files')
      } finally {
        setIsLoading(false)
      }
    }

    fetchFiles()
  }, [])

  // Filter files
  const filteredFiles = files.filter(file => {
    const matchesSearch = file.filename.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = selectedFileType === 'all' || file.type === selectedFileType
    return matchesSearch && matchesType
  })

  // Copy URL to clipboard
  const copyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url)
      // You could add a toast notification here
    } catch (error) {
      console.error('Failed to copy URL:', error)
    }
  }

  // Delete file
  const deleteFile = async (fileId: string) => {
    if (!confirm('Are you sure you want to delete this file?')) return
    
    try {
      // In real implementation:
      // const token = localStorage.getItem('admin_token')
      // await fetch(`/api/v1/media/${fileId}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } })
      
      setFiles(prev => prev.filter(f => f.id !== fileId))
    } catch (error) {
      console.error('Failed to delete file:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Media Library</h1>
          <p className="text-muted-foreground">
            Manage your images, documents, and other media files
          </p>
        </div>
        <Button disabled>
          <Upload className="mr-2 h-4 w-4" />
          Upload Files (Coming Soon)
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                variant={selectedFileType === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFileType('all')}
              >
                All
              </Button>
              <Button
                variant={selectedFileType === 'image' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFileType('image')}
              >
                Images
              </Button>
              <Button
                variant={selectedFileType === 'document' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFileType('document')}
              >
                Documents
              </Button>
              <Button
                variant={selectedFileType === 'video' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFileType('video')}
              >
                Videos
              </Button>
            </div>

            <div className="flex gap-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Media Files */}
      <Card>
        <CardHeader>
          <CardTitle>Files ({filteredFiles.length})</CardTitle>
          <CardDescription>
            {filteredFiles.length === 0 
              ? 'No files found'
              : `${filteredFiles.length} file${filteredFiles.length !== 1 ? 's' : ''} found`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : filteredFiles.length === 0 ? (
            <div className="text-center py-8">
              <FolderOpen className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground mt-2">No files found</p>
              {searchQuery && (
                <Button 
                  variant="outline" 
                  onClick={() => setSearchQuery('')}
                  className="mt-2"
                >
                  Clear Search
                </Button>
              )}
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {filteredFiles.map((file) => {
                const FileIcon = getFileIcon(file.mimetype)
                return (
                  <div key={file.id} className="relative group">
                    <div 
                      className="aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:bg-gray-200 transition-colors"
                      onClick={() => {
                        setSelectedFile(file)
                        setIsDialogOpen(true)
                      }}
                    >
                      {file.type === 'image' ? (
                        <img
                          src={file.url}
                          alt={file.filename}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                            e.currentTarget.nextElementSibling?.removeAttribute('hidden')
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FileIcon className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                      
                      {/* Fallback for broken images */}
                      <div hidden className="w-full h-full flex items-center justify-center bg-gray-100">
                        <FileIcon className="h-8 w-8 text-muted-foreground" />
                      </div>
                    </div>

                    <div className="mt-2 space-y-1">
                      <p className="text-sm font-medium truncate" title={file.filename}>
                        {file.filename}
                      </p>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          {file.type}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatFileSize(file.size)}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="secondary" size="sm" className="h-6 w-6 p-0">
                            <MoreHorizontal className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => copyUrl(file.url)}>
                            <Copy className="mr-2 h-4 w-4" />
                            Copy URL
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <a href={file.url} download={file.filename}>
                              <Download className="mr-2 h-4 w-4" />
                              Download
                            </a>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => deleteFile(file.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredFiles.map((file) => {
                const FileIcon = getFileIcon(file.mimetype)
                return (
                  <div key={file.id} className="flex items-center space-x-4 p-3 border rounded-lg hover:bg-gray-50">
                    <div className="flex-shrink-0">
                      {file.type === 'image' ? (
                        <img
                          src={file.url}
                          alt={file.filename}
                          className="w-10 h-10 object-cover rounded"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                            e.currentTarget.nextElementSibling?.removeAttribute('hidden')
                          }}
                        />
                      ) : (
                        <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded">
                          <FileIcon className="h-5 w-5 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{file.filename}</p>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>{formatFileSize(file.size)}</span>
                        <Badge variant="outline" className="text-xs">
                          {file.type}
                        </Badge>
                        <span>Uploaded {new Date(file.uploaded_at).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => copyUrl(file.url)}>
                          <Copy className="mr-2 h-4 w-4" />
                          Copy URL
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <a href={file.url} download={file.filename}>
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </a>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => deleteFile(file.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* File Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          {selectedFile && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedFile.filename}</DialogTitle>
                <DialogDescription>
                  File details and preview
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                {selectedFile.type === 'image' && (
                  <div className="w-full max-h-64 bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={selectedFile.url}
                      alt={selectedFile.filename}
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>File size:</strong> {formatFileSize(selectedFile.size)}
                  </div>
                  <div>
                    <strong>Type:</strong> {selectedFile.mimetype}
                  </div>
                  <div>
                    <strong>Uploaded:</strong> {new Date(selectedFile.uploaded_at).toLocaleDateString()}
                  </div>
                  <div>
                    <strong>Uploaded by:</strong> {selectedFile.uploaded_by}
                  </div>
                </div>
                
                <div>
                  <strong>URL:</strong>
                  <Input
                    value={selectedFile.url}
                    readOnly
                    className="mt-1"
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => copyUrl(selectedFile.url)}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copy URL
                </Button>
                <Button asChild>
                  <a href={selectedFile.url} download={selectedFile.filename}>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </a>
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}