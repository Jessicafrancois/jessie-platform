'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import ReactFlow, {
  Background, BackgroundVariant, Controls, MiniMap,
  useNodesState, useEdgesState, addEdge,
  Connection, Edge, Node, ReactFlowProvider,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { supabase } from '@/lib/supabase'
import WebNode, { WebNodeType, WebNodeData, TYPE_META } from './WebNode'
import AddNodeToolbar from './AddNodeToolbar'
import './web-canvas.css'

const nodeTypes = { webNode: WebNode }

type Props = {
  projectId: string
  projectTitle: string
}

export default function ProjectWebCanvas({ projectId, projectTitle }: Props) {
  const [nodes, setNodes, onNodesChange] = useNodesState<WebNodeData>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const saveTimers = useRef(new Map<string, ReturnType<typeof setTimeout>>())

  useEffect(() => { loadWeb() }, [projectId])

  // ── Load nodes + edges from Supabase ──────────────────────
  async function loadWeb() {
    setLoading(true)

    const [nodesRes, edgesRes] = await Promise.all([
      supabase.from('web_nodes').select('*')
        .eq('entity_type', 'project').eq('entity_id', projectId),
      supabase.from('web_edges').select('*')
        .eq('entity_type', 'project').eq('entity_id', projectId),
    ])

    const loadedNodes: Node<WebNodeData>[] = (nodesRes.data || []).map(n => ({
      id: n.id,
      type: 'webNode',
      position: { x: n.position_x, y: n.position_y },
      data: {
        type: n.type,
        title: n.title,
        content: n.content,
        color: n.color,
        onUpdate: (updates: Partial<Pick<WebNodeData, 'title' | 'content' | 'color'>>) => updateNode(n.id, updates),
        onDelete: () => deleteNode(n.id),
      },
    }))

    const loadedEdges: Edge[] = (edgesRes.data || []).map(e => ({
      id: e.id,
      source: e.source_node_id,
      target: e.target_node_id,
      label: e.label || undefined,
      style: { stroke: 'rgba(255,255,255,.25)' },
    }))

    setNodes(loadedNodes)
    setEdges(loadedEdges)
    setLoading(false)
  }

  // ── Update a node (title / content / color) — debounced save ──
  function updateNode(id: string, updates: Partial<Pick<WebNodeData, 'title' | 'content' | 'color'>>) {
    setNodes(prev => prev.map(n => n.id === id ? { ...n, data: { ...n.data, ...updates } } : n))

    setSaving(true)
    clearTimeout(saveTimers.current.get(id))
    const timer = setTimeout(async () => {
      await supabase.from('web_nodes').update({
        ...updates,
        updated_at: new Date().toISOString(),
      }).eq('id', id)
      setSaving(false)
    }, 500)
    saveTimers.current.set(id, timer)
  }

  // ── Delete a node + any edges touching it ──────────────────
  async function deleteNode(id: string) {
    setNodes((prev: Node<WebNodeData>[]) =>prev.filter( (n: Node<WebNodeData>) => n.id !== id))
    setEdges((prev: Edge[]) => prev.filter( (e: Edge) => e.source !== id && e.target !== id ))
    await supabase.from('web_nodes').delete().eq('id', id)
  }

  // ── Persist position after drag ────────────────────────────
  async function handleNodeDragStop(_: unknown, node: Node) {
    await supabase.from('web_nodes').update({
      position_x: node.position.x,
      position_y: node.position.y,
    }).eq('id', node.id)
  }

  // ── Create a connection between two cards ──────────────────
  const onConnect = useCallback(async (connection: Connection) => {
    const id = crypto.randomUUID()
    const newEdge: Edge = { ...connection, id, style: { stroke: 'rgba(255,255,255,.25)' } } as Edge
    setEdges((prev: Edge[]) => addEdge(newEdge, prev))

    await supabase.from('web_edges').insert({
      id,
      entity_type: 'project',
      entity_id: projectId,
      source_node_id: connection.source,
      target_node_id: connection.target,
    })
  }, [projectId])

  // ── Add a new card of a given type ─────────────────────────
  async function addNode(type: WebNodeType) {
    const id = crypto.randomUUID()
    const color = TYPE_META[type].defaultColor
    const position = { x: 240 + Math.random() * 300, y: 160 + Math.random() * 280 }
    const title = `New ${TYPE_META[type].label}`

    const newNode: Node<WebNodeData> = {
      id,
      type: 'webNode',
      position,
      data: {
        type, title, content: '', color,
        onUpdate: (u: Partial<Pick<WebNodeData, 'title' | 'content' | 'color'>>) => updateNode(id, u),
        onDelete: () => deleteNode(id),
      },
    }

    setNodes((prev: Node<WebNodeData>[]) => [
  ...prev,
  newNode,
])

    await supabase.from('web_nodes').insert({
      id,
      entity_type: 'project',
      entity_id: projectId,
      type, title, content: '', color,
      position_x: position.x,
      position_y: position.y,
    })
  }

  if (loading) {
    return <div className="web-canvas-loading">Loading project web...</div>
  }

  return (
    <div className="web-canvas-page">

      <div className="web-canvas-header">
        <div>
          <span className="web-canvas-label">Project Web</span>
          <h1>{projectTitle}</h1>
        </div>
        <span className="web-canvas-save-status">
          {saving ? 'Saving…' : 'All changes saved'}
        </span>
      </div>

      <AddNodeToolbar onAddAction={addNode} />

      <div className="web-canvas-flow-wrapper">
        <ReactFlowProvider>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeDragStop={handleNodeDragStop}
            nodeTypes={nodeTypes}
            fitView
            minZoom={0.2}
            maxZoom={2}
          >
            <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="rgba(255,255,255,.08)" />
            <Controls />
            <MiniMap
              style={{ background: '#0b0b0b' }}
              maskColor="rgba(0,0,0,.6)"
              nodeColor={(n: Node) => ((n.data as WebNodeData)?.color ??'#888888')}
            />
          </ReactFlow>
        </ReactFlowProvider>
      </div>

    </div>
  )
}