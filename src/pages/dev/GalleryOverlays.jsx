import { useState } from 'react'
import Button from '../../components/ui/Button.jsx'
import Card from '../../components/ui/Card.jsx'
import Modal from '../../components/ui/Modal.jsx'
import { useUI } from '../../context/UIContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'

export default function GalleryOverlays() {
  const ui = useUI()
  const toast = useToast()
  const [basicModalOpen, setBasicModalOpen] = useState(false)

  return (
    <div className="page-wrap py-12 space-y-12">
      <div>
        <span className="eyebrow">Interactive Modals & Drawers</span>
        <h1 className="text-display text-fg font-extrabold mt-1">Overlays & Modals</h1>
        <p className="text-sm text-fg-muted mt-2">
          Accessible, animatable modal dialogs and slide-overs with focus trapping and keyboard navigation.
        </p>
      </div>

      <Card className="p-6 space-y-4">
        <h3 className="text-base font-semibold text-fg">Trigger Global Overlays</h3>
        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={() => setBasicModalOpen(true)}>
            Open Test Modal
          </Button>
          <Button variant="secondary" onClick={ui.openSearch}>
            Command Palette (⌘K)
          </Button>
          <Button variant="secondary" onClick={ui.openScoring}>
            Scoring Transparency
          </Button>
          <Button variant="secondary" onClick={ui.openRolePicker}>
            Role Switcher
          </Button>
          <Button variant="secondary" onClick={ui.openShare}>
            Share Profile
          </Button>
        </div>
      </Card>

      <Card className="p-6 space-y-4">
        <h3 className="text-base font-semibold text-fg">Toast Notifications</h3>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            size="sm"
            onClick={() =>
              toast({
                title: 'Operation successful',
                description: 'Your changes have been saved to local memory.',
                tone: 'success',
              })
            }
          >
            Trigger Success Toast
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              toast({
                title: 'Recalibrating scores',
                description: 'Derived 8-dimensional weighted vectors for new role.',
                tone: 'info',
              })
            }
          >
            Trigger Info Toast
          </Button>

          <Button
            size="sm"
            variant="danger"
            onClick={() =>
              toast({
                title: 'Skill gap alert',
                description: 'Target role requires Advanced proficiency in TypeScript.',
                tone: 'warning',
              })
            }
          >
            Trigger Warning Toast
          </Button>
        </div>
      </Card>

      <Modal
        open={basicModalOpen}
        onClose={() => setBasicModalOpen(false)}
        title="Sample Accessible Dialog"
        description="Features backdrop blur, focus trap, Escape key closing, and fluid transitions."
      >
        <div className="space-y-4 pt-2">
          <p className="text-xs text-fg-muted leading-relaxed">
            This dialog is rendered directly into the body portal with automatic scroll locks on the root document.
          </p>
          <div className="flex justify-end gap-2">
            <Button size="sm" variant="secondary" onClick={() => setBasicModalOpen(false)}>
              Close
            </Button>
            <Button size="sm" onClick={() => setBasicModalOpen(false)}>
              Confirm
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
