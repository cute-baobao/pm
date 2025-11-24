interface OrganizationInviteTemplateProps {
  organizationName: string;
  inviteLink: string;
}

export function OrganizationInviteTemplate({
  organizationName,
  inviteLink,
}: OrganizationInviteTemplateProps) {
  return (
    <div
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        lineHeight: '1.6',
        color: '#333333',
        maxWidth: '600px',
        margin: '0 auto',
        padding: '20px',
      }}
    >
      {/* Header */}
      <div
        style={{
          textAlign: 'center',
          paddingBottom: '30px',
          borderBottom: '2px solid #f0f0f0',
        }}
      >
        <h1
          style={{
            color: '#1a1a1a',
            fontSize: '24px',
            fontWeight: '600',
            margin: '0',
          }}
        >
          Projects
        </h1>
      </div>

      {/* Main Content */}
      <div style={{ padding: '30px 0' }}>
        <p style={{ fontSize: '16px', marginBottom: '20px' }}>您好，</p>

        <p style={{ fontSize: '16px', marginBottom: '20px' }}>
          您被邀请加入{' '}
          <strong style={{ color: '#0070f3' }}>{organizationName}</strong>。
        </p>

        <p style={{ fontSize: '16px', marginBottom: '30px' }}>
          点击下方按钮接受邀请：
        </p>

        {/* CTA Button */}
        <div style={{ textAlign: 'center', margin: '30px 0' }}>
          <a
            href={inviteLink}
            style={{
              display: 'inline-block',
              backgroundColor: '#0070f3',
              color: '#ffffff',
              padding: '14px 32px',
              textDecoration: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: '600',
            }}
          >
            接受邀请
          </a>
        </div>

        {/* Alternative Link */}
        <p
          style={{
            fontSize: '14px',
            color: '#666666',
            marginTop: '30px',
            paddingTop: '20px',
            borderTop: '1px solid #f0f0f0',
          }}
        >
          如果按钮无法点击，请复制以下链接到浏览器：
          <br />
          <a
            href={inviteLink}
            style={{ color: '#0070f3', wordBreak: 'break-all' }}
          >
            {inviteLink}
          </a>
        </p>
      </div>

      {/* Footer */}
      <div
        style={{
          marginTop: '40px',
          paddingTop: '20px',
          borderTop: '2px solid #f0f0f0',
          textAlign: 'center',
          fontSize: '12px',
          color: '#999999',
        }}
      >
        <p style={{ margin: '5px 0' }}>如果您没有请求此邀请，请忽略此邮件。</p>
      </div>
    </div>
  );
}
