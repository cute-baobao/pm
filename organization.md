# Organization Feature Checklist

## 1. Organization Management (组织管理)
- [x] **Create Organization**: User can create new org (name, slug, logo, metadata)
- [ ] **Update Organization**: Modify organization info
- [ ] **Delete Organization**: Delete entire organization
- [ ] **Active Organization**: Track current working organization in session
- [x] **List Organizations**: Get all organizations user belongs to
- [ ] **Check Slug**: Verify if organization slug is available

## 2. Member Management (成员管理)
- [ ] **Invite Member**: Invite user via email
- [ ] **Add Member**: Directly add member (Server-side)
- [ ] **Remove Member**: Remove member from organization
- [ ] **Update Member Role**: Modify member's role/permissions
- [ ] **List Members**: Paginated list of organization members
- [ ] **Leave Organization**: Member voluntarily leaves organization

## 3. Invitation System (邀请系统)
- [ ] **Send Invitation**: Create and send invitation email
- [ ] **Accept Invitation**: User accepts invitation
- [ ] **Reject Invitation**: User rejects invitation
- [ ] **Cancel Invitation**: Cancel sent invitation
- [ ] **Invitation Status**: Handle pending, accepted, rejected, canceled
- [ ] **Invitation Expiry**: Configure invitation link validity

## 4. Access Control (权限控制)
- [ ] **Role System**: Default roles (owner, admin, member)
- [ ] **Permission Check**: Verify user permissions
- [ ] **Custom Permissions**: Define custom resources and operations
- [ ] **Multi-role Support**: Members can have multiple roles
- [ ] **Dynamic Access Control**: Store and manage roles in database

## 5. Teams (Optional) (团队功能)
- [ ] **Create Team**: Create sub-team within organization
- [ ] **Team Members**: Manage team membership
- [ ] **Active Team**: Track current working team

## 6. Lifecycle Hooks (生命周期钩子)
- [ ] **Organization Hooks**: before/after create
- [ ] **Member Hooks**: before/after add/remove
- [ ] **Invitation Hooks**: before create, after accept

## 7. Configuration (配置选项)
- [ ] **Creation Limits**: Control who can create organizations
- [ ] **Quantity Limits**: Limits on orgs, members, invitations
- [ ] **Custom Schema**: Custom table/field names
