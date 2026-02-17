import OrganizationInvitationEmail from "@/components/emails/org-invitation";

export default function Page() {
  return (
    <>
      <OrganizationInvitationEmail email="sameer.edu19@gmail.com" inviteLink="hello.com" invitedByEmail="Sameer.edu19@gmail.com" invitedByUsername="sameer@7" teamName="sameer ki team"/>
    </>
  )
}