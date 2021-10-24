import { Injectable } from '@angular/core';
import { asyncScheduler, defer, fromEventPattern, of } from 'rxjs';
import { distinctUntilChanged, map, startWith, throttleTime } from 'rxjs/operators';

import BREAKPOINTS from '../stylings/partials/_breakpoints.json';

const THROTTLE = 300; // Milliseconds to throttle updates for viewport change

export type ViewportType = 'mobile' | 'tablet' | 'desktop' | 'wide';

@Injectable({
    providedIn: 'root'
})
export class ViewportService {

    private pixelToType(pixelWidth: number): ViewportType {
        switch ( true ) {
            case pixelWidth <= BREAKPOINTS.mobile : return 'mobile';
            case pixelWidth <= BREAKPOINTS.tablet : return 'tablet';
            case pixelWidth <= BREAKPOINTS.desktop : return 'desktop';
            default: return 'wide';
        }
    }

    /** Returns a stream of named viewport types */
    get viewportType$() {
        return defer(() => fromEventPattern(
            handler => window.addEventListener('resize', handler, {passive: true}),
            handler => window.removeEventListener('resize', handler),
        ).pipe(
            throttleTime(THROTTLE, asyncScheduler, {leading: false, trailing: true}),
            map(() => window.innerWidth),
            startWith(window.innerWidth),
            map(this.pixelToType),
            distinctUntilChanged()
        ));
    }

    /** Returns a stream of booleans, indicating if current viewport matches viewportType */
    viewportIs$(viewportType: ViewportType) {
        return this.viewportType$.pipe(
            map(currentType => currentType === viewportType),
            distinctUntilChanged()
        );
    }

    /** Return specific value for each viewport */
    mapViewport<T = unknown>(mobile: T, ...rest: T[]) {
        const portMap: Record<ViewportType, T> = {
            mobile,
            tablet: rest[0] ?? mobile,
            desktop: rest[1] ?? rest[0] ?? mobile,
            wide: rest[2] ?? rest[1] ?? rest[0] ?? mobile
        };
        return this.viewportType$.pipe(
            map(viewportType => portMap[viewportType])
        );
    }

}
