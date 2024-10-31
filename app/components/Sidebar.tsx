'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  HomeIcon, 
  Cog6ToothIcon, 
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { getCurrentProject } from '../actions/project';
import { getProjects } from '../actions/project';
import { useSession } from 'next-auth/react';
import UserMenu from './UserMenu';
import ProjectSelector from './ProjectSelector';
import { Project } from '../types/project';

interface MenuItem {
  name: string;
  href: string;
  icon: React.ForwardRefExoticComponent<any>;
  requiresAuth?: boolean;
}

const menuItems: MenuItem[] = [
  { name: 'Overview', href: '/', icon: HomeIcon },
  { 
    name: 'Project Settings', 
    href: '/settings', 
    icon: Cog6ToothIcon, 
    requiresAuth: true 
  },
  { 
    name: 'Project Planning', 
    href: '/planning', 
    icon: ClipboardDocumentListIcon, 
    requiresAuth: true 
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [hasProject, setHasProject] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const { data: session, status } = useSession();

  const checkProject = async () => {
    if (session) {
      const project = await getCurrentProject();
      setCurrentProject(project);
      setHasProject(!!project);
      
      const projectsList = await getProjects();
      setProjects(projectsList);
    } else {
      setCurrentProject(null);
      setHasProject(false);
      setProjects([]);
    }
  };

  useEffect(() => {
    checkProject();
  }, [pathname, session]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'projectChanged') {
        checkProject();
        router.refresh();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const visibleMenuItems = menuItems.filter(item => 
    !item.requiresAuth || (item.requiresAuth && session)
  );

  return (
    <aside className="w-56 bg-gray-50/50 text-gray-600 p-4 min-h-screen flex flex-col border-r border-gray-200">
      <div className="flex items-center mb-4">
        <img src="/globe.svg" alt="Logo" className="h-6 w-6 mr-2 opacity-75" />
        <h1 className="text-lg font-medium text-gray-700">Project AI</h1>
      </div>

      {session && (
        <div className="mb-4">
          <ProjectSelector 
            currentProject={currentProject}
            projects={projects}
          />
        </div>
      )}

      <nav className="flex-1">
        <ul className="space-y-1">
          {visibleMenuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            const isDisabled = item.requiresAuth && !hasProject;
            
            return (
              <li key={item.name}>
                {isDisabled ? (
                  <span
                    className="flex items-center px-3 py-2 rounded-md text-gray-400 cursor-not-allowed"
                    title="Select a project first"
                  >
                    <Icon className="w-4 h-4 min-w-[1rem] min-h-[1rem] mr-3" />
                    <span className="text-sm">{item.name}</span>
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className={`flex items-center px-3 py-2 rounded-md text-sm transition-colors
                      hover:bg-white border ${
                      isActive 
                        ? 'bg-white text-gray-900 font-medium border-gray-100 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900 border-transparent'
                    }`}
                  >
                    <Icon className="w-6 h-6 min-w-[1rem] min-h-[1rem] mr-3" />
                    <span>{item.name}</span>
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-auto pt-4 border-t border-gray-100">
        <UserMenu user={session?.user || null} />
      </div>
    </aside>
  );
} 