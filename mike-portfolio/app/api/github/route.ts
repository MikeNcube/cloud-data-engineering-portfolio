import { NextResponse } from 'next/server';

const COLORS = ['#0066FF', '#00C896', '#FF5F57', '#FFBD2E', '#8B5CF6', '#EC4899'];

export async function GET() {
  try {
    const res = await fetch('https://api.github.com/users/MikeNcube/repos?sort=updated&per_page=20', {
      headers: { 'Accept': 'application/vnd.github.v3+json' },
      next: { revalidate: 3600 }
    });
    const repos = await res.json();
    const projects = repos
      .filter((r: any) => !r.fork && r.description)
      .slice(0, 8)
      .map((r: any, i: number) => ({
        num: String(i + 1).padStart(2, '0'),
        title: r.name.replace(/-/g, ' '),
        desc: r.description || 'No description available.',
        tags: [r.language || 'Code', r.topics?.[0] || 'GitHub'].filter(Boolean),
        metrics: [
          { val: String(r.stargazers_count || 0), label: 'Stars' },
          { val: String(r.forks_count || 0), label: 'Forks' },
        ],
        color: COLORS[i % COLORS.length],
        url: r.html_url,
      }));
    return NextResponse.json(projects);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
