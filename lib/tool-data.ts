// Tool data for the application
export const toolData = {
  1: {
    id: 1,
    name: 'Docker',
    description: 'Docker is a platform for developing, shipping, and running applications using containerization technology. It enables developers to package applications and their dependencies into lightweight, portable containers.',
    category: 'DevOps',
    stars: 68900,
    downloads: '10B+',
    license: 'Apache 2.0',
    lastUpdated: '2024-01-15',
    tags: ['containerization', 'deployment', 'microservices', 'virtualization'],
    verified: true,
    aiScore: 95,
    compatibility: ['Linux', 'Windows', 'macOS'],
    deploymentReady: true,
    website: 'https://docker.com',
    github: 'https://github.com/docker',
    documentation: 'https://docs.docker.com',
    maintainers: ['Docker Inc.'],
    languages: ['Go', 'Shell', 'Python'],
    fileSize: '250MB',
    versions: ['24.0.7', '24.0.6', '24.0.5'],
    requirements: {
      memory: '2GB RAM',
      storage: '1GB',
      os: 'Linux, Windows, macOS'
    },
    features: [
      'Container orchestration',
      'Image management',
      'Multi-platform support',
      'Docker Compose',
      'Swarm mode',
      'Registry integration'
    ],
    useCases: [
      'Microservices deployment',
      'Development environment consistency',
      'CI/CD pipelines',
      'Application isolation',
      'Cloud migration'
    ],
    similarTools: [
      { name: 'Podman', similarity: 85 },
      { name: 'LXC', similarity: 70 },
      { name: 'Kubernetes', similarity: 65 }
    ],
    pricing: {
      personal: 'Free',
      pro: '$5/month',
      team: '$7/month',
      business: 'Custom'
    },
    support: {
      community: 'Forum, GitHub Issues',
      documentation: 'Comprehensive docs',
      training: 'Official training available',
      enterprise: '24/7 support available'
    }
  }
};