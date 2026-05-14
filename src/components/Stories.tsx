import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import StoryCircle from './stories/StoryCircle';
import StoryViewer from './stories/StoryViewer';
import UploadModal from './UploadModal';

interface Story {
  id: string;
  user_id: string;
  image_url: string;
  created_at: string;
  profiles?: {
    username: string;
    avatar_url: string;
    display_name: string;
  };
}

export default function Stories() {
  const [stories, setStories] = useState<Story[]>([]);
  const [activeStoryIdx, setActiveStoryIdx] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStories();

    const channel = supabase
      .channel('story_updates')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'stories' }, () => {
        fetchStories();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    let timer: any;
    if (activeStoryIdx !== null) {
      timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            handleNext();
            return 0;
          }
          return prev + 1.25; // Balanced for ~4 seconds
        });
      }, 50);
    }
    return () => clearInterval(timer);
  }, [activeStoryIdx]);

  const fetchStories = async () => {
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('stories')
      .select('*, profiles(username, avatar_url, display_name)')
      .gt('expires_at', now)
      .order('created_at', { ascending: false });
    
    if (!error && data) setStories(data as any);
    setIsLoading(false);
  };

  const handleNext = () => {
    if (activeStoryIdx !== null) {
      if (activeStoryIdx < stories.length - 1) {
        setActiveStoryIdx(activeStoryIdx + 1);
        setProgress(0);
      } else {
        setActiveStoryIdx(null);
      }
    }
  };

  const handlePrev = () => {
    if (activeStoryIdx !== null && activeStoryIdx > 0) {
      setActiveStoryIdx(activeStoryIdx - 1);
      setProgress(0);
    }
  };

  return (
    <div className="relative">
      <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-6 no-scrollbar px-1 py-1">
        {/* Add Story Button */}
        <StoryCircle isAddButton onClick={() => setIsUploadOpen(true)} />

        {/* Story List */}
        {isLoading ? (
          Array(4).fill(0).map((_, i) => (
            <StoryCircle key={i} isLoading onClick={() => {}} />
          ))
        ) : (
          stories.map((story, idx) => (
            <StoryCircle
              key={story.id}
              story={story}
              onClick={() => { setActiveStoryIdx(idx); setProgress(0); }}
            />
          ))
        )}
      </div>

      <UploadModal 
        isOpen={isUploadOpen} 
        onClose={() => setIsUploadOpen(false)} 
        onSuccess={fetchStories} 
        type="story" 
      />

      {/* Story Viewer Overlay */}
      <AnimatePresence>
        {activeStoryIdx !== null && (
          <StoryViewer 
            stories={stories}
            activeIdx={activeStoryIdx}
            onClose={() => setActiveStoryIdx(null)}
            onNext={handleNext}
            onPrev={handlePrev}
            progress={progress}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

