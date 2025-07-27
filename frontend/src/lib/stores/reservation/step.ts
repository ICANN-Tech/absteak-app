import { derived, writable } from 'svelte/store'

export type StepStatus = 'completed' | 'current' | 'pending'
export enum StepLabel {
  Personal = 'Personal',
  Information = 'Information',
  Payment = 'Payment',
}

export type Step = {
  id: number
  label: StepLabel
  status: StepStatus
  iconClass?: string
}

const initialSteps: Step[] = [
  { id: 1, label: StepLabel.Personal, status: 'completed', iconClass: 'bg-yellow-600' },
  { id: 2, label: StepLabel.Information, status: 'current', iconClass: 'bg-primary-600' },
  { id: 3, label: StepLabel.Payment, status: 'pending' }
]

export const steps = writable<Step[]>(initialSteps)
export const currentStep = derived(steps, $steps => $steps.find(s => s.status === 'current'))

export const goToStep = (stepId: number) => {
  steps.update(current => {
    return current.map(step => {
      if (step.id < stepId) return { ...step, status: 'completed' }
      if (step.id === stepId) return { ...step, status: 'current' }
      return { ...step, status: 'pending' }
    })
  })
}

export const goToNextStep = () => {
  steps.update(current => {
    const currentStep = current.find(s => s.status === 'current')
    if (!currentStep) return current

    const nextStep = current.find(s => s.id === currentStep.id + 1)
    if (!nextStep) return current

    return current.map(step => {
      if (step.id < nextStep.id) return { ...step, status: 'completed' }
      if (step.id === nextStep.id) return { ...step, status: 'current' }
      return { ...step, status: 'pending' }
    })
  })
}

export const goToPrevStep = () => {
  steps.update(current => {
    const currentStep = current.find(s => s.status === 'current')
    if (!currentStep) return current

    const prevStep = current.find(s => s.id === currentStep.id - 1)
    if (!prevStep) return current

    return current.map(step => {
      if (step.id < prevStep.id) return { ...step, status: 'completed' }
      if (step.id === prevStep.id) return { ...step, status: 'current' }
      return { ...step, status: 'pending' }
    })
  })
}
