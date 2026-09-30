import { useState } from 'react'
import { Copy, Check, ExternalLink, Globe, Shield, Share2 } from 'lucide-react'
import Modal from '../ui/Modal.jsx'
import Button from '../ui/Button.jsx'
import Badge from '../ui/Badge.jsx'
import { useProfileState } from '../../context/ProfileContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { BRAND, publicProfileUrl } from '../../config/brand.js'

export default function ShareProfileModal({ open, onClose }) {
  const { profile, settings } = useProfileState()
  const toast = useToast()
  const [copied, setCopied] = useState(false)

  const shareUrl = publicProfileUrl(profile.handle || 'alex-morgan')

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true)
      toast({
        title: 'Link copied to clipboard',
        description: 'You can now share your SkillRank profile with recruiters and peers.',
        tone: 'success',
      })
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const shareText = `Check out my verified career readiness profile on ${BRAND.name}: ${shareUrl}`

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Share Your Profile"
      description="Share your verified skills, projects, and readiness score with recruiters and peers."
      maxWidth="max-w-lg"
    >
      <div className="space-y-5">
        {/* Link box */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono uppercase tracking-wider text-fg-subtle">
            Public Profile Link
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="w-full px-3.5 py-2.5 rounded-xl border border-line bg-surface-2 text-xs font-mono text-fg select-all outline-none"
            />
            <Button
              size="sm"
              variant={copied ? 'success' : 'primary'}
              onClick={copyToClipboard}
              icon={copied ? Check : Copy}
            >
              {copied ? 'Copied' : 'Copy'}
            </Button>
          </div>
        </div>

        {/* Quick Social Shares */}
        <div className="grid grid-cols-2 gap-2.5">
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-line bg-surface hover:bg-surface-2 text-xs font-medium text-fg transition-colors"
          >
            <Share2 className="size-3.5 text-accent" />
            Share on LinkedIn
          </a>
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-line bg-surface hover:bg-surface-2 text-xs font-medium text-fg transition-colors"
          >
            <Share2 className="size-3.5 text-primary" />
            Share on X / Twitter
          </a>
        </div>

        {/* Privacy Note */}
        <div className="rounded-xl border border-line bg-surface-2/60 p-3.5 flex items-start gap-3">
          <Shield className="size-4 text-fg-subtle mt-0.5 shrink-0" />
          <div className="text-xs text-fg-muted space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-fg">Privacy Status:</span>
              <Badge variant={settings.privacy.publicProfile ? 'success' : 'warning'} size="sm">
                {settings.privacy.publicProfile ? 'Public' : 'Private'}
              </Badge>
            </div>
            <p>
              {settings.privacy.publicProfile
                ? 'Anyone with the link can view your skills, verified projects, and career readiness.'
                : 'Your profile is currently private. Enable public sharing in Settings to allow others to view it.'}
            </p>
          </div>
        </div>

        {/* Action button */}
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close
          </Button>
          <Button
            size="sm"
            to={`/u/${profile.handle || 'alex-morgan'}`}
            target="_blank"
            iconRight={ExternalLink}
          >
            Preview Profile
          </Button>
        </div>
      </div>
    </Modal>
  )
}
