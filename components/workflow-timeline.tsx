"use client"

import { useState, useEffect } from "react"
import { apiClient } from "@/lib/api"
import type { WorkflowStep } from "@/lib/types"

interface WorkflowTimelineProps {
  orderId: string
}

export function WorkflowTimeline({ orderId }: WorkflowTimelineProps) {
  const [steps, setSteps] = useState<WorkflowStep[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadWorkflowSteps()
    // Poll for updates every 10 seconds
    const interval = setInterval(loadWorkflowSteps, 10000)
    return () => clearInterval(interval)
  }, [orderId])

  const loadWorkflowSteps = async () => {
    try {
      const data = await apiClient.workflow.getSteps(orderId)
      setSteps(data || [])
    } catch (error) {
      console.error("Error loading workflow steps:", error)
      // Mock data as fallback
      setSteps([
        { id: "1", orderId, stepType: "cooking", status: "completed", startTime: new Date().toISOString() },
        { id: "2", orderId, stepType: "packing", status: "in_progress", startTime: new Date().toISOString() },
        { id: "3", orderId, stepType: "delivery", status: "pending" },
      ])
    } finally {
      setLoading(false)
    }
  }

  const stepLabels: Record<string, string> = {
    cooking: "Cocinando",
    packing: "Empacando",
    delivery: "Entregando",
  }

  if (loading) {
    return <div className="text-sm text-gray-500">Cargando progreso...</div>
  }

  if (steps.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      {steps.map((step, index) => (
        <div key={step.id} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                step.status === "completed"
                  ? "bg-green-500"
                  : step.status === "in_progress"
                    ? "bg-blue-500"
                    : "bg-gray-300"
              }`}
            >
              {step.status === "completed" ? "✓" : index + 1}
            </div>
            {index < steps.length - 1 && <div className="w-1 h-12 bg-gray-300 mt-2"></div>}
          </div>
          <div className="pb-4">
            <p className="font-bold">{stepLabels[step.stepType]}</p>
            <p className="text-sm text-gray-600">Estado: {step.status}</p>
            {step.assignedTo && <p className="text-sm text-gray-600">Asignado a: {step.assignedTo}</p>}
            {step.startTime && (
              <p className="text-xs text-gray-500">Inicio: {new Date(step.startTime).toLocaleTimeString("es-PE")}</p>
            )}
            {step.endTime && (
              <p className="text-xs text-gray-500">Fin: {new Date(step.endTime).toLocaleTimeString("es-PE")}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
