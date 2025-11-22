"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ChevronLeft, User, Clock, AlertCircle } from "lucide-react"
import { apiClient } from "@/lib/api"
import Header from "@/components/header"

export default function WorkflowPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()
  const [workflow, setWorkflow] = useState([])
  const [dataLoading, setDataLoading] = useState(true)
  const [error, setError] = useState("")
  const [updatingStepId, setUpdatingStepId] = useState<string | null>(null)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, isLoading, router])

  useEffect(() => {
    if (isAuthenticated) {
      fetchWorkflow()
    }
  }, [isAuthenticated])

  const fetchWorkflow = async () => {
    try {
      setDataLoading(true)
      setError("")
      const data = await apiClient.workflow.getSteps("")
      setWorkflow(data || [])
    } catch (err) {
      console.error("[v0] Error fetching workflow:", err)
      setError("Error al cargar el workflow")
    } finally {
      setDataLoading(false)
    }
  }

  const updateWorkflowStep = async (orderId: string, stepId: string, newStatus: string, assignedTo: string) => {
    try {
      setUpdatingStepId(stepId)
      await apiClient.workflow.updateStep(orderId, stepId, {
        status: newStatus,
        assignedTo,
        timestamp: new Date().toISOString(),
      })

      // Update local state
      setWorkflow(
        workflow.map((item) =>
          item.orderId === orderId
            ? {
                ...item,
                steps: item.steps.map((step: any) =>
                  step.id === stepId ? { ...step, status: newStatus, assignedTo } : step,
                ),
              }
            : item,
        ),
      )
    } catch (err) {
      console.error("[v0] Error updating workflow step:", err)
      setError("Error al actualizar el paso del workflow")
    } finally {
      setUpdatingStepId(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in_progress":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return "✓"
      case "in_progress":
        return "⏳"
      case "pending":
        return "○"
      default:
        return "○"
    }
  }

  if (isLoading || dataLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto mb-4"></div>
          <p className="text-slate-600">Cargando workflow...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        {/* Header */}
        <div className="bg-blue-900 text-white p-6 shadow-lg">
          <div className="max-w-7xl mx-auto flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" className="text-white hover:bg-blue-800">
                <ChevronLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Workflow de Pedidos</h1>
              <p className="text-blue-100 mt-1">Seguimiento del proceso de preparación y entrega</p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-8">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div className="space-y-6">
            {workflow.map((item) => (
              <Card key={item.orderId}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>{item.orderId}</CardTitle>
                      <CardDescription>Cliente: {item.customer}</CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    {item.steps?.map((step: any, idx: number) => (
                      <div key={idx} className="flex items-start gap-4">
                        {/* Timeline */}
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${step.status === "completed" ? "bg-green-600" : step.status === "in_progress" ? "bg-blue-600" : "bg-gray-400"}`}
                          >
                            {getStatusIcon(step.status)}
                          </div>
                          {idx < item.steps.length - 1 && <div className="w-1 h-12 bg-gray-300 my-2"></div>}
                        </div>

                        {/* Step Details */}
                        <div className="flex-1 pt-2">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-semibold text-slate-900">{step.role}</p>
                              <p className="text-sm text-slate-600 flex items-center gap-1">
                                <User className="w-4 h-4" />
                                {step.assignedTo || "Sin asignar"}
                              </p>
                            </div>
                            <Badge className={getStatusColor(step.status)}>
                              {step.status === "completed"
                                ? "Completado"
                                : step.status === "in_progress"
                                  ? "En Progreso"
                                  : "Pendiente"}
                            </Badge>
                          </div>

                          {step.startTime && (
                            <div className="text-sm text-slate-600 flex items-center gap-1 mb-3">
                              <Clock className="w-4 h-4" />
                              {step.startTime} - {step.endTime || "En progreso"}
                            </div>
                          )}

                          {/* Action Buttons */}
                          {step.status === "pending" && (
                            <Button
                              onClick={() => updateWorkflowStep(item.orderId, step.id, "in_progress", "Trabajador")}
                              disabled={updatingStepId === step.id}
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              {updatingStepId === step.id ? "Actualizando..." : "Iniciar"}
                            </Button>
                          )}
                          {step.status === "in_progress" && (
                            <Button
                              onClick={() => updateWorkflowStep(item.orderId, step.id, "completed", "Trabajador")}
                              disabled={updatingStepId === step.id}
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                            >
                              {updatingStepId === step.id ? "Actualizando..." : "Completar"}
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {workflow.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-slate-600">No hay pedidos en el workflow</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  )
}
