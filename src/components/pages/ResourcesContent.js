'use client';

import { useState } from 'react';

export default function ResourcesContent() {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedResource, setSelectedResource] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const resources = [
    {
      id: 1,
      title: 'Psychedelic Integration Handbook',
      type: 'document',
      category: 'integration',
      description: 'Comprehensive guide for post-session integration techniques and best practices.',
      author: 'Dr. Sarah Mitchell',
      date: '2024-01-10',
      size: '2.4 MB',
      downloads: 156,
      rating: 4.8,
      tags: ['integration', 'handbook', 'techniques'],
      content: 'A detailed handbook covering various integration approaches, including journaling prompts, meditation techniques, and lifestyle recommendations for patients.',
      url: '/resources/psychedelic-integration-handbook.pdf'
    },
    {
      id: 2,
      title: 'Safety Protocols Checklist',
      type: 'checklist',
      category: 'safety',
      description: 'Essential safety protocols and screening procedures for psychedelic-assisted therapy.',
      author: 'Dr. Michael Chen',
      date: '2024-01-08',
      size: '1.2 MB',
      downloads: 203,
      rating: 4.9,
      tags: ['safety', 'protocols', 'checklist'],
      content: 'Comprehensive safety checklist covering pre-session screening, contraindications, emergency procedures, and post-session monitoring.',
      url: '/resources/safety-protocols-checklist.pdf'
    },
    {
      id: 3,
      title: 'Patient Assessment Forms',
      type: 'forms',
      category: 'assessment',
      description: 'Standardized forms for patient assessment and progress tracking.',
      author: 'Dr. Emily Rodriguez',
      date: '2024-01-05',
      size: '3.1 MB',
      downloads: 189,
      rating: 4.7,
      tags: ['assessment', 'forms', 'tracking'],
      content: 'Complete set of assessment forms including intake questionnaires, progress tracking sheets, and outcome measurement tools.',
      url: '/resources/patient-assessment-forms.pdf'
    },
    {
      id: 4,
      title: 'Integration Journal Template',
      type: 'template',
      category: 'integration',
      description: 'Structured journal template for patient self-reflection and integration work.',
      author: 'Dr. David Kim',
      date: '2024-01-03',
      size: '0.8 MB',
      downloads: 234,
      rating: 4.6,
      tags: ['journal', 'template', 'reflection'],
      content: 'A guided journal template with prompts for daily reflection, session processing, and long-term integration goals.',
      url: '/resources/integration-journal-template.pdf'
    },
    {
      id: 5,
      title: 'Therapeutic Music Playlist',
      type: 'audio',
      category: 'sessions',
      description: 'Curated playlist of therapeutic music for psychedelic-assisted therapy sessions.',
      author: 'Dr. Lisa Thompson',
      date: '2024-01-01',
      size: '45.2 MB',
      downloads: 167,
      rating: 4.8,
      tags: ['music', 'playlist', 'therapy'],
      content: 'Carefully selected music tracks designed to support different phases of psychedelic therapy sessions.',
      url: '/resources/therapeutic-music-playlist.zip'
    },
    {
      id: 6,
      title: 'Consent Forms Package',
      type: 'forms',
      category: 'legal',
      description: 'Comprehensive consent forms and legal documentation for psychedelic therapy.',
      author: 'Legal Team',
      date: '2023-12-28',
      size: '4.2 MB',
      downloads: 145,
      rating: 4.9,
      tags: ['consent', 'legal', 'documentation'],
      content: 'Complete set of consent forms, liability waivers, and legal documentation required for psychedelic therapy practice.',
      url: '/resources/consent-forms-package.pdf'
    },
    {
      id: 7,
      title: 'Breathing Exercise Guide',
      type: 'video',
      category: 'techniques',
      description: 'Video guide demonstrating breathing exercises for anxiety management and preparation.',
      author: 'Dr. Sarah Mitchell',
      date: '2023-12-25',
      size: '125.8 MB',
      downloads: 198,
      rating: 4.7,
      tags: ['breathing', 'anxiety', 'preparation'],
      content: 'Step-by-step video demonstrations of various breathing techniques for patient preparation and anxiety management.',
      url: '/resources/breathing-exercise-guide.mp4'
    },
    {
      id: 8,
      title: 'Research Literature Database',
      type: 'database',
      category: 'research',
      description: 'Curated database of recent research papers and studies on psychedelic therapy.',
      author: 'Research Team',
      date: '2023-12-20',
      size: '15.6 MB',
      downloads: 89,
      rating: 4.9,
      tags: ['research', 'literature', 'studies'],
      content: 'Comprehensive database of peer-reviewed research papers, case studies, and clinical trials related to psychedelic therapy.',
      url: '/resources/research-literature-database.xlsx'
    }
  ];

  const categories = [
    { id: 'all', label: 'All Resources', count: resources.length },
    { id: 'integration', label: 'Integration', count: resources.filter(r => r.category === 'integration').length },
    { id: 'safety', label: 'Safety', count: resources.filter(r => r.category === 'safety').length },
    { id: 'assessment', label: 'Assessment', count: resources.filter(r => r.category === 'assessment').length },
    { id: 'sessions', label: 'Sessions', count: resources.filter(r => r.category === 'sessions').length },
    { id: 'legal', label: 'Legal', count: resources.filter(r => r.category === 'legal').length },
    { id: 'techniques', label: 'Techniques', count: resources.filter(r => r.category === 'techniques').length },
    { id: 'research', label: 'Research', count: resources.filter(r => r.category === 'research').length }
  ];

  const getTypeIcon = (type) => {
    switch (type) {
      case 'document':
        return '📄';
      case 'checklist':
        return '✅';
      case 'forms':
        return '📋';
      case 'template':
        return '📝';
      case 'audio':
        return '🎵';
      case 'video':
        return '🎥';
      case 'database':
        return '🗄️';
      default:
        return '📁';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'document':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'checklist':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'forms':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'template':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'audio':
        return 'bg-pink-500/20 text-pink-400 border-pink-500/30';
      case 'video':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'database':
        return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const filteredResources = resources.filter(resource => {
    const matchesCategory = activeTab === 'all' || resource.category === activeTab;
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleDownload = (resource) => {
    alert(`Downloading ${resource.title}...`);
  };

  const handleViewDetails = (resource) => {
    setSelectedResource(resource);
  };

  const handleShare = (resource) => {
    alert(`Sharing ${resource.title}...`);
  };

  const handleAddToFavorites = (resource) => {
    alert(`Added ${resource.title} to favorites`);
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-playfair font-bold text-white">Resources & Materials</h2>
          <p className="text-slate-400">Tools, documents, and educational content for clinical practice</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64 bg-slate-800/50 border border-slate-600/50 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:border-cyan-500 focus:outline-none"
            />
            <div className="absolute right-3 top-2.5 text-slate-400">
              🔍
            </div>
          </div>
        </div>
      </div>

      {/* Resource Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Resources</p>
              <p className="text-2xl font-bold text-white">{resources.length}</p>
            </div>
            <div className="text-2xl">📚</div>
          </div>
        </div>
        <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Downloads This Month</p>
              <p className="text-2xl font-bold text-white">1,397</p>
            </div>
            <div className="text-2xl">⬇️</div>
          </div>
        </div>
        <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">New This Week</p>
              <p className="text-2xl font-bold text-white">3</p>
            </div>
            <div className="text-2xl">🆕</div>
          </div>
        </div>
        <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Average Rating</p>
              <p className="text-2xl font-bold text-white">4.8</p>
            </div>
            <div className="text-2xl">⭐</div>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="bg-slate-700/30 rounded-xl p-1 border border-slate-600/30">
        <div className="flex space-x-1 overflow-x-auto">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveTab(category.id)}
              className={`flex-shrink-0 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === category.id
                  ? 'bg-cyan-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-600/50'
              }`}
            >
              {category.label} ({category.count})
            </button>
          ))}
        </div>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-white mb-2">No resources found</h3>
            <p className="text-slate-400">No resources match your search criteria</p>
          </div>
        ) : (
          filteredResources.map((resource) => (
            <div
              key={resource.id}
              className="bg-slate-700/30 rounded-xl p-6 border border-slate-600/30 hover:border-cyan-500/30 transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-3xl">{getTypeIcon(resource.type)}</div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleAddToFavorites(resource)}
                    className="text-slate-400 hover:text-yellow-400 transition-colors"
                  >
                    ⭐
                  </button>
                  <button
                    onClick={() => handleShare(resource)}
                    className="text-slate-400 hover:text-cyan-400 transition-colors"
                  >
                    📤
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <h3 className="text-lg font-semibold text-white mb-2">{resource.title}</h3>
                <p className="text-slate-300 text-sm mb-3">{resource.description}</p>
                <div className="flex items-center space-x-2 mb-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(resource.type)}`}>
                    {resource.type.toUpperCase()}
                  </span>
                  <span className="text-slate-400 text-xs">by {resource.author}</span>
                </div>
              </div>

              <div className="space-y-2 text-sm text-slate-400 mb-4">
                <div className="flex justify-between">
                  <span>Size:</span>
                  <span>{resource.size}</span>
                </div>
                <div className="flex justify-between">
                  <span>Downloads:</span>
                  <span>{resource.downloads}</span>
                </div>
                <div className="flex justify-between">
                  <span>Rating:</span>
                  <span className="flex items-center space-x-1">
                    <span>⭐</span>
                    <span>{resource.rating}</span>
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span>{resource.date}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {resource.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-slate-800/50 text-slate-300 text-xs rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleDownload(resource)}
                  className="flex-1 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 text-sm"
                >
                  Download
                </button>
                <button
                  onClick={() => handleViewDetails(resource)}
                  className="bg-slate-600/50 hover:bg-slate-600/70 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 text-sm"
                >
                  View
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Resource Details Modal */}
      {selectedResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedResource(null)}
          />
          
          <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-800/95 backdrop-blur-xl border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-slate-700/50 to-slate-600/50 p-6 border-b border-slate-600/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-4xl">{getTypeIcon(selectedResource.type)}</div>
                  <div>
                    <h2 className="text-2xl font-playfair font-bold text-white">{selectedResource.title}</h2>
                    <p className="text-slate-300">by {selectedResource.author}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedResource(null)}
                  className="text-slate-400 hover:text-white text-2xl transition-colors"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 max-h-[70vh] overflow-y-auto scrollbar-thin">
              <div className="space-y-6">
                {/* Resource Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-700/30 rounded-xl p-4">
                    <h3 className="text-lg font-semibold text-white mb-3">Resource Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Type:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(selectedResource.type)}`}>
                          {selectedResource.type.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Size:</span>
                        <span className="text-white">{selectedResource.size}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Downloads:</span>
                        <span className="text-white">{selectedResource.downloads}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Rating:</span>
                        <span className="flex items-center space-x-1">
                          <span>⭐</span>
                          <span>{selectedResource.rating}</span>
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Date:</span>
                        <span className="text-white">{selectedResource.date}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-700/30 rounded-xl p-4">
                    <h3 className="text-lg font-semibold text-white mb-3">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedResource.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-slate-800/50 text-slate-300 text-xs rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="bg-slate-700/30 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-white mb-3">Description</h3>
                  <p className="text-slate-300">{selectedResource.description}</p>
                </div>

                {/* Content */}
                <div className="bg-slate-700/30 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-white mb-3">Content Overview</h3>
                  <p className="text-slate-300">{selectedResource.content}</p>
                </div>

                {/* Actions */}
                <div className="bg-slate-700/30 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-white mb-3">Actions</h3>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => handleDownload(selectedResource)}
                      className="bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-300"
                    >
                      Download Resource
                    </button>
                    <button
                      onClick={() => handleShare(selectedResource)}
                      className="bg-slate-600/50 hover:bg-slate-600/70 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-300"
                    >
                      Share
                    </button>
                    <button
                      onClick={() => handleAddToFavorites(selectedResource)}
                      className="bg-yellow-600/50 hover:bg-yellow-600/70 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-300"
                    >
                      Add to Favorites
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
