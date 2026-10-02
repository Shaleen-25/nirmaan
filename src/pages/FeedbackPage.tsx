import { PageHeader } from '../components/ui'
import { BuildInPublic } from '../components/Feedback'

export default function FeedbackPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Feedback"
        dot="#FFC22E"
        title={<>Found a hole in the idea? <span className="text-pink">Tell me.</span></>}
        sub="Nirmaan is a work in progress, built in public. Every edge case, objection and better idea makes it sharper."
      />
      <BuildInPublic />
    </div>
  )
}
