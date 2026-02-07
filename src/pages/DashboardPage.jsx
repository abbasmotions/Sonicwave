import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Plus, Trash2, Edit2, Play, Loader } from 'lucide-react';

export default function DashboardPage() {
  const { profile } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setError('');
      const { data, error: err } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (err) throw err;
      setProjects(data || []);
    } catch (err) {
      setError('Failed to load projects');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (projectId) => {
    try {
      setDeleting(projectId);
      const { error: err } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (err) throw err;
      setProjects(projects.filter(p => p.id !== projectId));
    } catch (err) {
      setError('Failed to delete project');
      console.error(err);
    } finally {
      setDeleting(null);
    }
  };

  const getSubscriptionTierInfo = () => {
    const tier = profile?.subscription_tier || 'free';
    const limits = {
      free: { characters: 10000, audio: 120 },
      pro: { characters: 500000, audio: 3600 },
      team: { characters: -1, audio: -1 },
    };
    return limits[tier];
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-slate-400">Welcome back, {profile?.full_name || 'User'}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
          <p className="text-slate-400 text-sm mb-1">Plan</p>
          <p className="text-2xl font-bold text-white capitalize">{profile?.subscription_tier || 'Free'}</p>
          <Link to="/settings" className="text-blue-400 text-sm mt-2 inline-block hover:text-blue-300">
            Upgrade plan →
          </Link>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
          <p className="text-slate-400 text-sm mb-1">Projects</p>
          <p className="text-2xl font-bold text-white">{projects.length}</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
          <p className="text-slate-400 text-sm mb-1">Characters Used</p>
          <p className="text-2xl font-bold text-white">
            {getSubscriptionTierInfo().characters === -1 ? 'Unlimited' : getSubscriptionTierInfo().characters.toLocaleString()}
          </p>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Projects</h2>
          <Link
            to="/editor?new=true"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
          >
            <Plus className="w-5 h-5" />
            New Project
          </Link>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-200">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="w-8 h-8 text-slate-400 animate-spin" />
          </div>
        ) : projects.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-12 text-center">
            <p className="text-slate-400 mb-4">No projects yet</p>
            <Link
              to="/editor?new=true"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
            >
              Create your first project
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map(project => (
              <div
                key={project.id}
                className="bg-slate-900 border border-slate-800 rounded-lg p-6 hover:border-blue-500 transition group"
              >
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition line-clamp-2">
                    {project.title}
                  </h3>
                  <p className="text-sm text-slate-400 mt-1">
                    {new Date(project.created_at).toLocaleDateString()}
                  </p>
                </div>

                <p className="text-slate-400 text-sm line-clamp-2 mb-4">
                  {project.description || 'No description'}
                </p>

                <div className="flex gap-2">
                  <Link
                    to={`/editor/${project.id}`}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition text-sm"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </Link>
                  <button
                    onClick={() => deleteProject(project.id)}
                    disabled={deleting === project.id}
                    className="bg-red-600/20 hover:bg-red-600/30 text-red-400 p-2 rounded transition disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
