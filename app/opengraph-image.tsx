import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'FlowSync - Time Tracking Made Simple';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#030303',
          backgroundImage:
            'radial-gradient(circle at 25% 25%, rgba(30, 30, 30, 0.8) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(20, 20, 20, 0.8) 0%, transparent 50%)',
        }}
      >
        {/* Grid pattern overlay */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage:
              'linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
            zIndex: 1,
          }}
        />

        {/* Decorative circles */}
        <div
          style={{
            position: 'absolute',
            top: '10%',
            left: '5%',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(255, 255, 255, 0.03) 0%, transparent 70%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '10%',
            right: '5%',
            width: '250px',
            height: '250px',
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(255, 255, 255, 0.03) 0%, transparent 70%)',
          }}
        />

        {/* Content container */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
          }}
        >
          {/* Logo and brand */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: 40,
            }}
          >
            {/* Logo circle */}
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #FFFFFF 0%, #E0E0E0 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 24,
              }}
            >
              {/* Clock icon */}
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#000000"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <div
              style={{
                fontSize: 80,
                fontWeight: 800,
                background: 'linear-gradient(to right, #FFFFFF, #E0E0E0)',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              FlowSync
            </div>
          </div>

          {/* Tagline */}
          <div
            style={{
              fontSize: 32,
              fontWeight: 500,
              color: '#FFFFFF',
              opacity: 0.9,
              marginBottom: 40,
              textAlign: 'center',
            }}
          >
            Time Tracking Made Simple
          </div>

          {/* Feature highlights */}
          <div
            style={{
              display: 'flex',
              gap: 24,
              marginTop: 20,
            }}
          >
            {/* Feature 1 */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                borderRadius: 16,
                padding: '20px 30px',
                width: 200,
              }}
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ marginBottom: 12 }}
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <div style={{ color: '#FFFFFF', fontSize: 18, fontWeight: 600 }}>
                Time Tracking
              </div>
            </div>

            {/* Feature 2 */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                borderRadius: 16,
                padding: '20px 30px',
                width: 200,
              }}
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ marginBottom: 12 }}
              >
                <path d="M12 20V10" />
                <path d="M18 20V4" />
                <path d="M6 20v-4" />
              </svg>
              <div style={{ color: '#FFFFFF', fontSize: 18, fontWeight: 600 }}>
                Analytics
              </div>
            </div>

            {/* Feature 3 */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                borderRadius: 16,
                padding: '20px 30px',
                width: 200,
              }}
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ marginBottom: 12 }}
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <div style={{ color: '#FFFFFF', fontSize: 18, fontWeight: 600 }}>
                Calendar
              </div>
            </div>
          </div>

          {/* Bottom tagline */}
          <div
            style={{
              fontSize: 24,
              color: '#FFFFFF',
              opacity: 0.7,
              marginTop: 40,
              textAlign: 'center',
            }}
          >
            Boost your productivity with powerful insights
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
