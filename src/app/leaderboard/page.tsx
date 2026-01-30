import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { ArrowLeft, Trophy, Users } from 'lucide-react'
import CopyRefCode from '@/components/CopyRefCode'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function LeaderboardPage() {
    const { data: leaderboard, error } = await supabase
        .from('leaderboard')
        .select('*')

    return (
        <div className="min-h-screen bg-[#050505] text-white p-6 md:p-10 font-sans relative">
            {/* Background Glows */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="max-w-4xl mx-auto relative z-10">
                {/* Header */}
                <div className="flex flex-col items-center mb-12">
                    <Link href="/" className="self-start text-gray-500 hover:text-white flex items-center gap-2 mb-8 transition-colors">
                        <ArrowLeft size={20} /> Back to Home
                    </Link>
                    <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center mb-4 border border-blue-500/30">
                        <Trophy className="text-blue-500" size={32} />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500  tracking-tighter">
                        BaseRise Top 100
                    </h1>
                    <p className="text-gray-500 mt-2 font-mono uppercase tracking-[0.2em] text-sm">Elite Referral Program</p>
                    <div className="mt-4 flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        <p className="text-[10px] md:text-xs text-gray-400 font-medium tracking-wide uppercase">
                            For best experience, use <span className="text-blue-400">Laptop or PC</span>
                        </p>
                    </div>
                </div>

                {/* Table Container */}
                <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl">
                    <table className="w-full text-left">
                        <thead className="bg-white/[0.02] text-gray-400 text-xs uppercase tracking-widest">
                            <tr>
                                <th className="p-6 border-b border-white/5">Rank</th>
                                <th className="p-6 border-b border-white/5">Ambassador</th>
                                <th className="p-6 border-b border-white/5 text-center">Referral ID</th>
                                <th className="p-6 border-b border-white/5 text-right flex items-center justify-end gap-2">
                                    <Users size={14} /> Referrals
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {leaderboard?.map((user) => (
                                <tr key={user.ref_code} className="hover:bg-blue-600/[0.03] transition-colors group">
                                    <td className="p-6">
                                        <span className={`font-bold text-lg ${user.current_rank === 1 ? 'text-yellow-500' :
                                            user.current_rank === 2 ? 'text-gray-400' :
                                                user.current_rank === 3 ? 'text-amber-600' : 'text-blue-400'
                                            }`}>
                                            #{user.current_rank}
                                        </span>
                                    </td>
                                    <td className="p-6">
                                        {/* Ab hum seedha masked_email use kar rahay hain jo SQL se aa raha hai */}
                                        <span className="font-mono text-sm text-gray-300 group-hover:text-white transition-colors">
                                            {user.masked_email}
                                        </span>
                                    </td>
                                    <td className="p-6 text-center">
                                        <CopyRefCode code={user.ref_code} />
                                    </td>
                                    <td className="p-6 text-right font-black text-xl text-white italic tracking-tighter">
                                        {user.total_referrals}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {(!leaderboard || leaderboard.length === 0) && (
                        <div className="p-20 text-center text-gray-600 italic">
                            Competition is just heating up. Start referring!
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}