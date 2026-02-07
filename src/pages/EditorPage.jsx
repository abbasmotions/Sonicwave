import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Play, Save, Download, Loader, AlertCircle } from 'lucide-react';

export default function EditorPage() {
  const { projectId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('Welcome to SonicWave');
  const [voiceId, setVoiceId] = useState('en-US-1');
  const [audioUrl, setAudioUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [generating, setGenerating] = useState(false);

  const isNewProject = searchParams.get('new') === 'true' || !projectId;

  useEffect(() => {
    if (!isNewProject && projectId) {
      fetchProject();
    } else {
      setTitle('Untitled Project');
    }
  }, [projectId, isNewProject]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const { data, error: err } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();

      if (err) throw err;
      setTitle(data.title);
      setDescription(data.description);
      setContent(data.content);

      const { data: audioData } = await supabase
        .from('project_audio')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (audioData) {
        setAudioUrl(audioData.audio_url);
        setVoiceId(audioData.voice_id);
      }
    } catch (err) {
      setError('Failed to load project');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const saveProject = async () => {
    try {
      setSaving(true);
      setError('');

      if (!isNewProject) {
        const { error: err } = await supabase
          .from('projects')
          .update({
            title,
            description,
            content,
            updated_at: new Date(),
          })
          .eq('id', projectId);

        if (err) throw err;
      } else {
        const { data, error: err } = await supabase
          .from('projects')
          .insert([{
            user_id: user.id,
            title: title || 'Untitled Project',
            description,
            content,
          }])
          .select()
          .single();

        if (err) throw err;
        navigate(`/editor/${data.id}`);
      }
    } catch (err) {
      setError('Failed to save project');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const generateAudio = async () => {
    try {
      setGenerating(true);
      setError('');

      if (!isNewProject) {
        await saveProject();
      } else {
        const { data, error: err } = await supabase
          .from('projects')
          .insert([{
            user_id: user.id,
            title: title || 'Untitled Project',
            description,
            content,
          }])
          .select()
          .single();

        if (err) throw err;

        window.history.replaceState({}, '', `/editor/${data.id}`);
        setAudioUrl('');
      }

      const utterance = new SpeechSynthesisUtterance(content);
      window.speechSynthesis.speak(utterance);

      setAudioUrl('local://audio-demo');
    } catch (err) {
      setError('Failed to generate audio');
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  const downloadAudio = () => {
    if (!audioUrl) {
      setError('No audio to download');
      return;
    }
    const a = document.createElement('a');
    a.href = audioUrl;
    a.download = `${title || 'audio'}.mp3`;
    a.click();
  };

  const voices = [
    { id: 'en-US-1', name: 'US English - Female' },
    { id: 'en-US-2', name: 'US English - Male' },
    { id: 'en-GB-1', name: 'British English - Female' },
    { id: 'en-GB-2', name: 'British English - Male' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="w-8 h-8 text-slate-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">TTS Editor</h1>
        <p className="text-slate-400">Create and generate audio from your text</p>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-red-200">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">
              Project Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="Untitled Project"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="Optional description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">
              Text to Convert
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white h-80 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
              placeholder="Enter text here..."
            />
            <p className="text-xs text-slate-500 mt-2">
              {content.length} characters
            </p>
          </div>

          {audioUrl && audioUrl !== 'local://audio-demo' && (
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Generated Audio
              </label>
              <audio
                src={audioUrl}
                controls
                className="w-full"
              />
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">
              Voice
            </label>
            <select
              value={voiceId}
              onChange={(e) => setVoiceId(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              {voices.map(voice => (
                <option key={voice.id} value={voice.id}>
                  {voice.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <button
              onClick={generateAudio}
              disabled={!content.trim() || generating}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600 disabled:opacity-50 text-white font-medium py-2 rounded-lg transition"
            >
              {generating ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Generate Audio
                </>
              )}
            </button>

            {audioUrl && (
              <button
                onClick={downloadAudio}
                className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-medium py-2 rounded-lg transition"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            )}

            <button
              onClick={saveProject}
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white font-medium py-2 rounded-lg transition"
            >
              {saving ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Project
                </>
              )}
            </button>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
            <p className="text-xs font-medium text-slate-200 mb-2">Quick Tips</p>
            <ul className="text-xs text-slate-400 space-y-1">
              <li>• Use natural language for best results</li>
              <li>• Add pauses with punctuation</li>
              <li>• Keep content under 5000 characters</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
