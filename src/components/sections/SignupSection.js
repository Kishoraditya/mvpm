'use client';

import EmailForm from '@/components/ui/EmailForm';
import CTAButton from '@/components/ui/CTAButton';

const SignupSection = () => {
  return (
    <section id="signup" className="signup-section">
      <h2 className="section-title">Join the Waitlist</h2>
      <p style={{ fontSize: '1.2rem', marginBottom: '2rem', color: 'rgba(255, 255, 255, 0.8)' }}>
        Be first to arm your organization with MVPM intelligence
      </p>
      
      <EmailForm source="landing_page" />
      
      <h3 style={{ margin: '4rem 0 2rem', fontSize: '1.8rem' }}>
        Ready to Find Out if You're MVPM Material?
      </h3>
      <p style={{ marginBottom: '2rem', color: 'rgba(255, 255, 255, 0.8)' }}>
        Five minutes. Four challenges. One chance to prove you've got what it takes.
      </p>
      
      <CTAButton 
        href="#games" 
        location="signup"
        style={{ marginBottom: '1rem' }}
      >
        Start the Challenge
      </CTAButton>
      <p style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.6)' }}>
        ✓ No signup required ✓ Anonymous play ✓ Instant results ✓ Bragging rights included
      </p>
    </section>
  );
};

export default SignupSection;
