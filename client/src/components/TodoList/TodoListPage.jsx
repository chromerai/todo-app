import { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronLeft, Trash2, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function TodoListPage() {
  const { listId } = useParams()
  const [, setLocation] = useLocation()
  const [list, setList] = useState(null)
  const [tasks, setTasks] = useState([])
  const [newTask, setNewTask] = useState('')
  const [loading, setLoading] = useState(true)
  const { user, signOut } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    if (listId) {
      fetchList()
      fetchTasks()
    }
  }, [listId])

  const fetchList = async () => {
    const { data, error } = await supabase
      .from('lists')
      .select('*')
      .eq('listid', listId)
      .single()
    if (error) {
      toast({ title: 'Error', description: 'List not found', variant: 'destructive' })
      setLocation('/dashboard')
    } else {
      setList(data)
    }
  }

  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('listid', listId)
      .order('createdat', { ascending: false })
    if (error) throw error
    setTasks(data)
    setLoading(false)
  }

  const handleAddTask = async (e) => {
    e.preventDefault()
    if (!newTask.trim()) return

    try {
      const { error } = await supabase
        .from('tasks')
        .insert([{ listid: listId, task_text: newTask, iscompleted: false }])
      if (error) throw error
      setNewTask('')
      fetchTasks()
    } catch (error) {
      toast({ title: 'Error adding task', description: error.message, variant: 'destructive' })
    }
  }

  const toggleTask = async (taskId, isCompleted) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ iscompleted: !isCompleted })
        .eq('taskid', taskId)
      if (error) throw error
      setTasks(tasks.map(t => t.taskid === taskId ? { ...t, iscompleted: !isCompleted } : t))
    } catch (error) {
      toast({ title: 'Error updating task', description: error.message, variant: 'destructive' })
    }
  }

  const deleteTask = async (taskId) => {
    try {
      const { error } = await supabase.from('tasks').delete().eq('taskid', taskId)
      if (error) throw error
      setTasks(tasks.filter(t => t.taskid !== taskId))
    } catch (error) {
      toast({ title: 'Error deleting task', description: error.message, variant: 'destructive' })
    }
  }

  const deleteList = async () => {
    if (!confirm('Delete this list and all its tasks?')) return
    try {
      const { error } = await supabase.from('lists').delete().eq('listid', listId)
      if (error) throw error
      setLocation('/dashboard')
    } catch (error) {
      toast({ title: 'Error deleting list', description: error.message, variant: 'destructive' })
    }
  }

  if (loading) return <div className="p-8 text-center">Loading...</div>

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b p-4 flex justify-between items-center bg-card sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setLocation('/dashboard')}>
            <ChevronLeft />
          </Button>
          <h1 className="text-xl font-bold">{list?.list_name}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={deleteList} className="text-destructive">
            <Trash2 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => signOut()}>
            <LogOut className="w-4 h-4 mr-2" /> Sign Out
          </Button>
        </div>
      </header>

      <main className="p-6 max-w-2xl mx-auto">
        <form onSubmit={handleAddTask} className="flex gap-2 mb-8">
          <Input 
            placeholder="Add a new task..." 
            value={newTask} 
            onChange={(e) => setNewTask(e.target.value)}
          />
          <Button type="submit">Add</Button>
        </form>

        <div className="space-y-3">
          {tasks.map(task => (
            <div key={task.taskid} className="flex items-center justify-between p-3 border rounded-lg bg-card hover-elevate">
              <div className="flex items-center gap-3 flex-1">
                <Checkbox 
                  checked={task.iscompleted} 
                  onCheckedChange={() => toggleTask(task.taskid, task.iscompleted)}
                />
                <span className={task.iscompleted ? 'line-through text-muted-foreground' : ''}>
                  {task.task_text}
                </span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => deleteTask(task.taskid)}>
                <Trash2 className="w-4 h-4 text-muted-foreground" />
              </Button>
            </div>
          ))}

          {tasks.length === 0 && (
            <p className="text-center text-muted-foreground py-10">No tasks yet. Add your first task above!</p>
          )}
        </div>
      </main>
    </div>
  )
}
