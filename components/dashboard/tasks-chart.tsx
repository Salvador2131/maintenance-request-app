'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Task, TaskType, TaskPriority } from '@/lib/types'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'

const typeLabels: Record<TaskType, string> = {
  electrico: 'Eléctrico',
  informatico: 'Informático',
  fontaneria: 'Fontanería',
  climatizacion: 'Climatización',
  general: 'General',
}

const priorityLabels: Record<TaskPriority, string> = {
  baja: 'Baja',
  media: 'Media',
  alta: 'Alta',
  urgente: 'Urgente',
}

const priorityColors: Record<TaskPriority, string> = {
  baja: 'hsl(var(--chart-1))',
  media: 'hsl(var(--chart-2))',
  alta: 'hsl(var(--chart-3))',
  urgente: 'hsl(var(--chart-5))',
}

interface TasksChartProps {
  tasks: Task[]
}

export function TasksByTypeChart({ tasks }: TasksChartProps) {
  const data = Object.entries(
    tasks.reduce(
      (acc, task) => {
        acc[task.type] = (acc[task.type] || 0) + 1
        return acc
      },
      {} as Record<TaskType, number>
    )
  ).map(([type, count]) => ({
    type: typeLabels[type as TaskType],
    count,
  }))

  const chartConfig = {
    count: {
      label: 'Tareas',
      color: 'hsl(var(--chart-1))',
    },
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Tareas por Tipo</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <BarChart data={data} layout="vertical">
            <XAxis type="number" />
            <YAxis dataKey="type" type="category" width={100} tick={{ fontSize: 12 }} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="count" fill="var(--color-count)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export function TasksByPriorityChart({ tasks }: TasksChartProps) {
  const data = Object.entries(
    tasks.reduce(
      (acc, task) => {
        acc[task.priority] = (acc[task.priority] || 0) + 1
        return acc
      },
      {} as Record<TaskPriority, number>
    )
  ).map(([priority, value]) => ({
    name: priorityLabels[priority as TaskPriority],
    value,
    fill: priorityColors[priority as TaskPriority],
  }))

  const chartConfig = {
    value: {
      label: 'Tareas',
    },
    baja: {
      label: 'Baja',
      color: priorityColors.baja,
    },
    media: {
      label: 'Media',
      color: priorityColors.media,
    },
    alta: {
      label: 'Alta',
      color: priorityColors.alta,
    },
    urgente: {
      label: 'Urgente',
      color: priorityColors.urgente,
    },
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Tareas por Prioridad</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <ChartTooltip content={<ChartTooltipContent />} />
          </PieChart>
        </ChartContainer>
        <div className="mt-4 flex flex-wrap justify-center gap-4">
          {data.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.fill }} />
              <span className="text-xs text-muted-foreground">{item.name}: {item.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
