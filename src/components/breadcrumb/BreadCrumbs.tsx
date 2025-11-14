// src/components/Breadcrumbs.tsx

import { useBreadcrumbs } from '@/context/BreadCrumbContext';
import { protectedRoutes } from '@/routes/routesData';
import React from 'react';
import type {JSX} from 'react'
import { Link, useLocation, useParams } from 'react-router-dom';

interface Breadcrumb {
    label: string;
    path: string;
}

interface RouteConfig {
    name: string;
    path: string;
    element: JSX.Element;
}

const Breadcrumbs: React.FC = () => {
    const location = useLocation();
    const params = useParams();

    const { extraBreadcrumbs } = useBreadcrumbs();

    // Build breadcrumbs based on current path
    const buildBreadcrumbs = (): Breadcrumb[] => {
        const path = location.pathname;
        const pathSegments = path.split('/').filter(Boolean);

        // Base case for dashboard
        if (
            pathSegments.length === 0 ||
            (pathSegments.length === 1 && pathSegments[0] === 'dashboard')
        ) {
            return [{ label: 'Dashboard', path: '/dashboard' }];
        }

        // Build breadcrumb array
        const breadcrumbs: Breadcrumb[] = [{ label: 'Dashboard', path: '/dashboard' }];
        let currentPath = '';

        // Iterate through path segments and match with routes
        for (const segment of pathSegments) {
            currentPath += `/${segment}`;

            // Skip navigation for document-management when it's a direct path
            // if (currentPath === '/document-management' || currentPath === '/user-management') {
            //     continue;
            // }

            // Check if this path exists in our routes (including dynamic routes)
            const findMatchingRoute = (routes: RouteConfig[]): RouteConfig | undefined => {
                for (const route of routes) {
                    // Check if route has dynamic segments
                    const routeSegments = route.path.split('/').filter(Boolean);
                    const currentSegments = currentPath.split('/').filter(Boolean);

                    if (routeSegments.length === currentSegments.length) {
                        let isMatch = true;
                        for (let j = 0; j < routeSegments.length; j++) {
                            if (
                                !routeSegments[j].startsWith(':') &&
                                routeSegments[j] !== currentSegments[j]
                            ) {
                                isMatch = false;
                                break;
                            }
                        }
                        if (isMatch) return route;
                    }

                    if (route.path === currentPath) {
                        return route;
                    }
                }
                return undefined;
            };

            const route = findMatchingRoute(protectedRoutes);

            if (route) {
                breadcrumbs.push({ label: route.name, path: currentPath });
            } else {
                // Skip adding breadcrumb for ID segments if we've already matched a dynamic route
                const isDynamicParam = Object.values(params).includes(segment);
                if (!isDynamicParam) {
                    breadcrumbs.push({
                        label: segment.charAt(0).toUpperCase() + segment.slice(1),
                        path: currentPath
                    });
                }
            }
        }

        // Add any extra breadcrumbs from context
        return [...breadcrumbs, ...extraBreadcrumbs];
    };

    const breadcrumbs = buildBreadcrumbs();

    // Don't render if only one breadcrumb (just Dashboard)
    // if (breadcrumbs.length <= 1) return null;

    return (
        <nav className='flex  mb-2 flex-wrap' aria-label='Breadcrumb'>
            <ol className='inline-flex items-center flex-wrap'>
                {breadcrumbs.map((crumb, index) => (
                    <li key={index} className='inline-flex items-center'>
                        {index > 0 && <span className='mx-1 text-brandText-secondary'>/</span>}
                        {index === breadcrumbs.length - 1 ? (
                            <span className='text-brandText-tertiary text-base font-normal'>{crumb.label}</span>
                        ) : (
                            <Link
                                to={crumb.path}
                                className='text-brandText-primary text-base font-normal'
                            >
                                {crumb.label}
                            </Link>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
};

export default Breadcrumbs;
