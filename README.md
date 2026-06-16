# Frontend

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.11.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Enterprise HRMS ERP Module

This project contains a comprehensive, highly interactive **Human Resource Management System (HRMS)** module located under `src/app/features/hrms`. It features a clean modular structure using Angular Standalone Components, Signals state management, and Tailwind CSS v4 utility classes.

### Folder Structure

```text
src/app/features/hrms/
├── hrms.component.ts               # Parent container shell managing tabs & navigation
├── hrms.component.html             # Sidebar navigation layout and tab routers
├── hrms.component.css              # Custom animations and scrollbar stylings
├── services/
│   └── hrms.service.ts             # Centralized state (Signals) and Mock API endpoints
└── components/
    ├── employee-directory/         # Employee control directory & salary slip generator
    ├── workflow-builder/           # Approval routing hierarchy timeline visualizer
    ├── time-attendance/            # Punch clock terminal simulator and daily log sheet
    ├── leave-management/           # Leave filing, balances tracking & approvals
    ├── shift-planner/              # Monday-Sunday roster shift scheduler
    ├── recruitment-ats/            # ATS Kanban, job postings & drag-drop CV resume parser
    ├── digital-onboarding/         # Checklist track lists, legal document verifications
    ├── performance-talent/         # Reviews, 360° feedbacks & career succession planning
    ├── learning-development/       # e-Learning stream player simulator & certifications
    └── analytics-experience/       # HR engagement metrics dashboards & ESS portal views
```

### Core Features

1.  **Employee Control**: Full profile registry, termination triggers, and interactive W-2 payslip breakdown.
2.  **Workflow Management**: Dynamic validation stages timeline (supervisor, HR, Finance approvals).
3.  **Time & Attendance**: Real-time server punch simulation, late grace indicators, and total hours tracker.
4.  **Leave Management**: Vacation balance sheets and supervisor sign-offs.
5.  **Shift Scheduling**: Roster assignments for Morning, Evening, and Night rotations.
6.  **Recruitment & ATS**: Applicant Kanban stages and simulated **AI Resume parser** (parsing PDF/DOCX to populate ATS pipelines).
7.  **Digital Onboarding**: Interactive checklists sorted by IT/HR/Finance category and onboarding document vault status.
8.  **Performance & Talent**: 360° peer reviews with competency ratings and technical succession maps.
9.  **Learning & Development**: Courses catalogs with integrated e-learning stream simulator and certifications download.
10. **Analytics & Employee Experience**: Retention/eNPS dashboards, weekly satisfaction surveys, and Employee Self Service (ESS) personal portal views.

### Mock API & Backend Integration

State is reactive and synchronized through [HrmsService](file:///home/hp/Desktop/frontend/src/app/features/hrms/services/hrms.service.ts). The service exposes emulated REST API endpoints using RxJS observables and simulated delay wrappers:
*   `getAppraisalsApi()` / `saveAppraisalApi()`
*   `getTrainingCoursesApi()` / `enrollInCourseApi()`
*   `getEngagementMetricsApi()` / `joinWellnessActivityApi()`

To connect this feature to a live backend, simply inject Angular `HttpClient` and replace the emulated asynchronous delay methods with actual HTTP requests (e.g. `this.http.get<Appraisal[]>('/api/appraisals')`).

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

