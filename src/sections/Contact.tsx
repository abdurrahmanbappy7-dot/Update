import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, ArrowUpRight, CheckCircle2, Loader2, Mail, MapPin, Phone, Send } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Reveal } from '../components/ui/Reveal';
import { SectionHeader } from '../components/ui/SectionHeader';
import { SocialLinks } from '../components/ui/SocialLinks';
import { profile } from '../data/profile';

type Fields = { name: string; email: string; subject: string; message: string };
type Status = 'idle' | 'sending' | 'sent' | 'error';

const empty: Fields = { name: '', email: '', subject: '', message: '' };

function validate(f: Fields) {
  const e: Partial<Record<keyof Fields, string>> = {};
  if (!f.name.trim()) e.name = 'Please enter your name.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = 'Please enter a valid email address.';
  if (!f.subject.trim()) e.subject = 'Please add a subject.';
  if (f.message.trim().length < 10) e.message = 'Your message should be at least 10 characters.';
  return e;
}

export function Contact() {
  const [fields, setFields] = useState<Fields>(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const [status, setStatus] = useState<Status>('idle');

  const set = (k: keyof Fields) => (e: { target: { value: string } }) => {
    setFields((f) => ({ ...f, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const found = validate(fields);
    setErrors(found);
    if (Object.keys(found).length) return;

    setStatus('sending');
    try {
      // Submissions are handled by Netlify Forms (see public/__forms.html).
      const body = new URLSearchParams(new FormData(e.currentTarget) as unknown as Record<string, string>).toString();
      const res = await fetch('/__forms.html', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus('sent');
      setFields(empty);
    } catch {
      setStatus('error');
    }
  };

  const field = (k: keyof Fields, label: string, type = 'text', autoComplete?: string) => (
    <div>
      <label htmlFor={`c-${k}`} className="mb-2 block font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
        {label}
      </label>
      <input
        id={`c-${k}`}
        name={k}
        type={type}
        autoComplete={autoComplete}
        value={fields[k]}
        onChange={set(k)}
        aria-invalid={Boolean(errors[k])}
        aria-describedby={errors[k] ? `c-${k}-err` : undefined}
        className="field"
      />
      {errors[k] && (
        <p id={`c-${k}-err`} className="mt-1.5 text-[12.5px] text-red-400">
          {errors[k]}
        </p>
      )}
    </div>
  );

  return (
    <section id="contact" className="relative overflow-hidden border-t hairline bg-surface/30 py-28 md:py-36">
      <div aria-hidden className="absolute left-1/2 top-0 -z-0 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-accent/[0.07] blur-[120px]" />
      <div className="shell relative">
        <SectionHeader
          index="09"
          label="Contact"
          title={
            <>
              Let’s build something <span className="text-gradient">together.</span>
            </>
          }
          intro="I’m open to internships, junior developer roles, collaborations, and conversations with people in tech. Reach me by email or phone."
        />

        <div className="grid gap-6 lg:grid-cols-12">
          <Reveal className="flex flex-col gap-6 lg:col-span-5">
            <a
              href={`mailto:${profile.email}`}
              className="card group flex items-center justify-between gap-4 p-6 transition hover:border-accent/40"
            >
              <span className="flex min-w-0 items-center gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent">
                  <Mail size={20} aria-hidden />
                </span>
                <span className="min-w-0">
                  <span className="block font-mono text-[11px] uppercase tracking-[0.16em] text-faint">Email</span>
                  <span className="block truncate text-[15px]">{profile.email}</span>
                </span>
              </span>
              <ArrowUpRight size={18} className="shrink-0 text-muted transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink" aria-hidden />
            </a>
            <a
              href={profile.phoneHref}
              className="card group flex items-center justify-between gap-4 p-6 transition hover:border-accent/40"
            >
              <span className="flex min-w-0 items-center gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent">
                  <Phone size={20} aria-hidden />
                </span>
                <span className="min-w-0">
                  <span className="block font-mono text-[11px] uppercase tracking-[0.16em] text-faint">Phone</span>
                  <span className="block truncate text-[15px]">{profile.phone}</span>
                </span>
              </span>
              <ArrowUpRight size={18} className="shrink-0 text-muted transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink" aria-hidden />
            </a>
            <div className="card flex items-center gap-4 p-6">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-cyan/10 text-cyan">
                <MapPin size={20} aria-hidden />
              </span>
              <span>
                <span className="block font-mono text-[11px] uppercase tracking-[0.16em] text-faint">Location</span>
                <span className="block text-[15px]">{profile.location}</span>
              </span>
            </div>
            <div className="card p-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-faint">Elsewhere</p>
              <div className="mt-4">
                <SocialLinks include={['linkedin', 'github', 'facebook', 'instagram', 'snapchat']} />
              </div>
            </div>
            <div className="flex items-center gap-3 px-1 text-[14px] text-muted">
              <span className="h-2 w-2 animate-pulse-dot rounded-full bg-ok" />
              {profile.availability}
            </div>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-7">
            <form
              name="contact"
              method="POST"
              data-netlify="true"
              netlify-honeypot="bot-field"
              noValidate
              onSubmit={onSubmit}
              className="card relative space-y-5 p-6 md:p-9"
            >
              <input type="hidden" name="form-name" value="contact" />
              <p className="hidden">
                <label>
                  Don’t fill this out: <input name="bot-field" tabIndex={-1} autoComplete="off" />
                </label>
              </p>
              <div className="grid gap-5 sm:grid-cols-2">
                {field('name', 'Name', 'text', 'name')}
                {field('email', 'Email', 'email', 'email')}
              </div>
              {field('subject', 'Subject')}
              <div>
                <label htmlFor="c-message" className="mb-2 block font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
                  Message
                </label>
                <textarea
                  id="c-message"
                  name="message"
                  rows={6}
                  value={fields.message}
                  onChange={set('message')}
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={errors.message ? 'c-message-err' : undefined}
                  className="field resize-y"
                />
                {errors.message && (
                  <p id="c-message-err" className="mt-1.5 text-[12.5px] text-red-400">
                    {errors.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
                <div aria-live="polite" className="min-h-[1.25rem] text-[13.5px]">
                  <AnimatePresence mode="wait">
                    {status === 'sent' && (
                      <motion.p key="ok" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-2 text-ok">
                        <CheckCircle2 size={16} aria-hidden /> Thanks — your message was sent.
                      </motion.p>
                    )}
                    {status === 'error' && (
                      <motion.p key="err" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-2 text-red-400">
                        <AlertCircle size={16} aria-hidden /> Something went wrong. Please email me directly.
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-medium text-white shadow-[0_8px_30px_-10px_rgb(var(--accent)/.7)] transition-all hover:-translate-y-0.5 disabled:opacity-60"
                >
                  {status === 'sending' ? (
                    <>
                      <Loader2 size={16} className="animate-spin" aria-hidden /> Sending…
                    </>
                  ) : (
                    <>
                      Send message <Send size={15} className="transition-transform group-hover:translate-x-0.5" aria-hidden />
                    </>
                  )}
                </button>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
