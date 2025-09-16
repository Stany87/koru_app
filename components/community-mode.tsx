"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { 
  ArrowLeft, 
  Users, 
  MessageCircle, 
  Heart, 
  Shield, 
  Clock, 
  Star,
  Send,
  Search,
  Filter,
  Plus,
  User,
  Lock,
  Globe,
  CheckCircle,
  AlertCircle,
  Sparkles
} from "lucide-react"

interface CommunityModeProps {
  onBack: () => void
}

// Mock data for community features
const supportGroups = [
  {
    id: 1,
    name: "Anxiety Support Circle",
    members: 1247,
    description: "A safe space for those dealing with anxiety disorders",
    category: "Anxiety",
    isPrivate: false,
    lastActivity: "2 hours ago",
    color: "from-blue-500/20 to-cyan-500/20"
  },
  {
    id: 2,
    name: "Depression Warriors",
    members: 892,
    description: "Supporting each other through depression and low moods",
    category: "Depression",
    isPrivate: false,
    lastActivity: "4 hours ago",
    color: "from-purple-500/20 to-pink-500/20"
  },
  {
    id: 3,
    name: "ADHD Focus Group",
    members: 634,
    description: "Tips, strategies, and support for ADHD challenges",
    category: "ADHD",
    isPrivate: false,
    lastActivity: "1 hour ago",
    color: "from-green-500/20 to-emerald-500/20"
  },
  {
    id: 4,
    name: "Sleep Wellness Circle",
    members: 445,
    description: "Improving sleep habits and managing insomnia",
    category: "Sleep",
    isPrivate: true,
    lastActivity: "6 hours ago",
    color: "from-indigo-500/20 to-blue-500/20"
  }
]

const recentPosts = [
  {
    id: 1,
    author: "Sarah M.",
    avatar: "👩",
    group: "Anxiety Support Circle",
    content: "Had a really tough day at work today. The anxiety was overwhelming, but I used the breathing technique we discussed last week. It helped! 💙",
    time: "2 hours ago",
    likes: 23,
    comments: 8,
    isLiked: false
  },
  {
    id: 2,
    author: "Alex K.",
    avatar: "👨",
    group: "Depression Warriors",
    content: "Small win today: I got out of bed, took a shower, and made myself breakfast. Some days that's enough. Proud of myself for taking care of me today.",
    time: "4 hours ago",
    likes: 45,
    comments: 12,
    isLiked: true
  },
  {
    id: 3,
    author: "Maya R.",
    avatar: "👩",
    group: "ADHD Focus Group",
    content: "Found this amazing app that helps with time management! It breaks tasks into 25-minute chunks. Game changer for my productivity!",
    time: "6 hours ago",
    likes: 18,
    comments: 5,
    isLiked: false
  }
]

const directMessages = [
  {
    id: 1,
    name: "Emma S.",
    avatar: "👩",
    lastMessage: "Thank you for the advice about meditation. It's really helping me sleep better!",
    time: "1 hour ago",
    unread: 2,
    isOnline: true
  },
  {
    id: 2,
    name: "David L.",
    avatar: "👨",
    lastMessage: "How are you feeling today? I'm here if you need to talk.",
    time: "3 hours ago",
    unread: 0,
    isOnline: false
  },
  {
    id: 3,
    name: "Lisa P.",
    avatar: "👩",
    lastMessage: "The breathing exercise you shared was amazing! Thank you so much 💜",
    time: "1 day ago",
    unread: 1,
    isOnline: true
  }
]

export default function CommunityMode({ onBack }: CommunityModeProps) {
  const [activeTab, setActiveTab] = useState<"groups" | "posts" | "messages">("groups")
  const [showCreateGroup, setShowCreateGroup] = useState(false)
  const [showNewMessage, setShowNewMessage] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [newGroupName, setNewGroupName] = useState("")
  const [newGroupDescription, setNewGroupDescription] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")

  const handleCreateGroup = () => {
    // In a real app, this would create a new group
    console.log("Creating group:", { newGroupName, newGroupDescription, selectedCategory })
    setShowCreateGroup(false)
    setNewGroupName("")
    setNewGroupDescription("")
    setSelectedCategory("")
  }

  const handleSendMessage = () => {
    // In a real app, this would send a message
    console.log("Sending message")
    setShowNewMessage(false)
  }

  const categories = ["Anxiety", "Depression", "ADHD", "Sleep", "General", "Recovery", "Wellness"]

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="glass border-b border-border p-4">
        <div className="flex items-center gap-4 max-w-6xl mx-auto">
          <Button variant="ghost" size="icon" className="glass-strong" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full glass flex items-center justify-center">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">Community</h1>
              <p className="text-sm text-muted-foreground">Connect with others on similar journeys</p>
            </div>
          </div>
        </div>
      </header>

      <div className="p-4 max-w-6xl mx-auto space-y-6">
        {/* Coming Soon Banner */}
        <Card className="glass-strong border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-primary">Community Features Coming Soon!</h3>
              <p className="text-sm text-muted-foreground">
                We're building a safe, supportive community where you can connect with others facing similar challenges. 
                Here's a preview of what's coming:
              </p>
            </div>
          </div>
        </Card>

        {/* Navigation Tabs */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar">
          <Button
            variant={activeTab === "groups" ? "default" : "outline"}
            onClick={() => setActiveTab("groups")}
            className="glass-strong whitespace-nowrap"
          >
            <Users className="h-4 w-4 mr-2" />
            Support Groups
          </Button>
          <Button
            variant={activeTab === "posts" ? "default" : "outline"}
            onClick={() => setActiveTab("posts")}
            className="glass-strong whitespace-nowrap"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Community Posts
          </Button>
          <Button
            variant={activeTab === "messages" ? "default" : "outline"}
            onClick={() => setActiveTab("messages")}
            className="glass-strong whitespace-nowrap"
          >
            <Heart className="h-4 w-4 mr-2" />
            Direct Messages
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search groups, posts, or people..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 glass-strong"
            />
          </div>
          <Button variant="outline" className="glass-strong">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>

        {/* Content based on active tab */}
        {activeTab === "groups" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Support Groups</h2>
              <Button 
                onClick={() => setShowCreateGroup(true)}
                className="glass-strong"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Group
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {supportGroups.map((group) => (
                <Card key={group.id} className={`glass-strong p-4 hover:scale-105 transition-transform cursor-pointer bg-gradient-to-br ${group.color}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full glass flex items-center justify-center">
                        <Users className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{group.name}</h3>
                        <p className="text-xs text-muted-foreground">{group.category}</p>
                      </div>
                    </div>
                    {group.isPrivate ? (
                      <Lock className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Globe className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">{group.description}</p>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{group.members.toLocaleString()} members</span>
                    <span>{group.lastActivity}</span>
                  </div>
                  
                  <Button className="w-full mt-3 glass" size="sm">
                    Join Group
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === "posts" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Community Posts</h2>
              <Button className="glass-strong">
                <Plus className="h-4 w-4 mr-2" />
                New Post
              </Button>
            </div>

            <div className="space-y-4">
              {recentPosts.map((post) => (
                <Card key={post.id} className="glass-strong p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full glass flex items-center justify-center text-lg">
                      {post.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">{post.author}</span>
                        <span className="text-xs text-muted-foreground">in</span>
                        <span className="text-xs text-primary">{post.group}</span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">{post.time}</span>
                      </div>
                      <p className="text-sm">{post.content}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <Button variant="ghost" size="sm" className="h-8">
                      <Heart className={`h-4 w-4 mr-1 ${post.isLiked ? 'text-red-500 fill-current' : ''}`} />
                      {post.likes}
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      {post.comments}
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8">
                      <Send className="h-4 w-4 mr-1" />
                      Share
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === "messages" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Direct Messages</h2>
              <Button 
                onClick={() => setShowNewMessage(true)}
                className="glass-strong"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Message
              </Button>
            </div>

            <div className="space-y-2">
              {directMessages.map((dm) => (
                <Card key={dm.id} className="glass-strong p-4 hover:scale-[1.02] transition-transform cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full glass flex items-center justify-center text-lg">
                        {dm.avatar}
                      </div>
                      {dm.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-background"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold">{dm.name}</h3>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">{dm.time}</span>
                          {dm.unread > 0 && (
                            <div className="w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center">
                              {dm.unread}
                            </div>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{dm.lastMessage}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Safety Notice */}
        <Card className="glass-strong border-yellow-500/20 bg-gradient-to-r from-yellow-500/5 to-orange-500/5 p-4">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-yellow-500 mt-0.5" />
            <div>
              <h4 className="font-semibold text-yellow-600">Community Safety</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Our community is moderated to ensure a safe, supportive environment. 
                All conversations are peer-to-peer support and should not replace professional medical advice.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Create Group Dialog */}
      <Dialog open={showCreateGroup} onOpenChange={setShowCreateGroup}>
        <DialogContent className="glass-strong border-border">
          <DialogHeader>
            <DialogTitle>Create Support Group</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Group Name</label>
              <Input
                placeholder="Enter group name"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Description</label>
              <Textarea
                placeholder="Describe what this group is about"
                value={newGroupDescription}
                onChange={(e) => setNewGroupDescription(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-2 border border-border rounded-md bg-background"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCreateGroup} className="flex-1">
                Create Group
              </Button>
              <Button variant="outline" onClick={() => setShowCreateGroup(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* New Message Dialog */}
      <Dialog open={showNewMessage} onOpenChange={setShowNewMessage}>
        <DialogContent className="glass-strong border-border">
          <DialogHeader>
            <DialogTitle>Send Message</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">To</label>
              <Input placeholder="Search for a person..." />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Message</label>
              <Textarea
                placeholder="Type your message..."
                rows={4}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSendMessage} className="flex-1">
                Send Message
              </Button>
              <Button variant="outline" onClick={() => setShowNewMessage(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}



