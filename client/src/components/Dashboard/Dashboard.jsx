import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../context/AuthContext";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const [lists, setLists] = useState([])
  const [loading, setLoading] = useState(true)
  const { user, signOut } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    fetchLists()
  }, [])

  const fetchLists = async () => {
    try {
      const { data, error } = await supabase
        .from('lists')
        .select('*')
        .eq('userid', user.id)
        .order('createdat', { ascending: false })

      if (error) throw error
      setLists(data)
    } catch (error) {
      toast({ title: 'Error fetching lists', description: error.message, variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateList = async () => {
    const listName = prompt('Enter list name:')
    if (!listName) return

    try {
      const { error } = await supabase
        .from('lists')
        .insert([{ list_name: listName, userid: user.id }])

      if (error) throw error
      fetchLists()
    } catch (error) {
      toast({ title: 'Error creating list', description: error.message, variant: 'destructive' })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b p-4 flex justify-between items-center bg-card">
        <h1 className="text-xl font-bold">My Lists</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground hidden sm:inline">{user?.email}</span>
          <Button variant="ghost" size="sm" onClick={() => signOut()}>
            <LogOut className="w-4 h-4 mr-2" /> Sign Out
          </Button>
        </div>
      </header>

      <main className="p-6 max-w-7xl mx-auto">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => <Card key={i} className="h-32 animate-pulse bg-muted" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card 
              className="border-dashed flex flex-col items-center justify-center p-6 cursor-pointer hover:bg-accent transition-colors min-h-[150px]"
              onClick={handleCreateList}
            >
              <Plus className="w-8 h-8 mb-2" />
              <span className="font-medium">Add New List</span>
            </Card>

            {lists.map(list => (
              <Link key={list.listid} href={`/list/${list.listid}`}>
                <Card className="cursor-pointer hover-elevate h-full">
                  <CardHeader>
                    <CardTitle>{list.list_name}</CardTitle>
                    {list.list_type && (
                      <div className="text-xs font-semibold px-2 py-1 bg-secondary rounded-full w-fit">
                        {list.list_type}
                      </div>
                    )}
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Created {new Date(list.createdat).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {!loading && lists.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground mb-4">No lists yet. Create your first list to get started!</p>
            <Button onClick={handleCreateList}>Create Your First List</Button>
          </div>
        )}
      </main>
    </div>
  )
}
