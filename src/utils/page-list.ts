export const pageDescriptions = [
  {
    path: '/announcements',
    description:
      'A page to display all league-wide announcements and updates. This page should show a list of announcements with their titles, dates, and a brief summary. Users should be able to click on an announcement to view the full details. This page should be accessible to all users, including spectators.',
  },
  {
    path: '/announcements/create',
    description:
      'A page for administrators to create a new league-wide announcement. This page should have a form to enter the announcement title, content, and any relevant attachments or images. The administrator should be able to preview the announcement before publishing it.',
  },
  {
    path: '/calendar-integrations',
    description:
      'A settings page for managing calendar integrations. Users can connect their Google Calendar, Outlook, or other supported calendar platforms to sync their game schedules. This page will also allow users to customize sync settings and preferences.',
  },
  {
    path: '/calendar-integrations/create',
    description:
      'A form for creating a new calendar integration. Users can select the calendar platform they want to connect and provide the necessary authentication credentials.',
  },
  {
    path: '/leaderboards',
    description:
      'A page displaying leaderboards for various statistical categories such as goals scored, assists, defensive plays, and more. The leaderboards will showcase the top players in each category, fostering a competitive spirit and recognition within the league. Users can filter and sort the leaderboards based on different criteria like team, position, or time period.',
  },
  {
    path: '/leaderboards/create',
    description:
      'A form to create a new leaderboard category. Administrators can define the statistical criteria, display settings, and other parameters for the new leaderboard.',
  },
  {
    path: '/messages',
    description:
      "A page to display a list of direct message conversations between users. This page should show a list of conversations with the participants' names, the last message preview, and the timestamp of the last message. A dashboard displaying all direct messages between users, organized by conversation. Users can view their existing conversations and start new ones. A page to display a list of direct messages between users. This page should be accessible to players, team captains, and administrators. It should allow users to view their existing conversations and start new ones.",
  },
  {
    path: '/messages/create',
    description:
      'A page to initiate a new direct message conversation with one or more recipients. Users can select the recipients and compose the initial message. Users should be able to select the recipient(s) from a list of other users they are allowed to message based on their role.',
  },
  {
    path: '/notifications',
    description:
      'A page to display a list of email notifications received by the user. This page should show the notification title, date, and a brief summary. Users should be able to click on a notification to view the full details. This page should be accessible to players, team captains, and administrators. It should show details of each notification, such as the subject, date, and a preview of the content.',
  },
  {
    path: '/notifications/settings',
    description:
      'A page for users to manage their email notification settings. This page should allow users to configure which types of notifications they want to receive (e.g., upcoming games, league updates, direct messages) and the frequency of notifications. This should allow users to customize the types of notifications they receive and the frequency or conditions under which they are sent.',
  },
  {
    path: '/notifications/settings/create',
    description:
      'A page for administrators to create new email notification templates or rules. This should include forms to define the trigger conditions, recipient roles, and the content of the notification.',
  },
  {
    path: '/reschedule',
    description:
      'A dashboard for rescheduling games. This page will display a list of games that need to be rescheduled due to weather, conflicts, or other reasons. Administrators and team captains can select a game and propose new date/time options, which will be validated against the scheduling logic and league rules.',
  },
  {
    path: '/schedules',
    description:
      "A dashboard displaying the upcoming game schedule for the entire league. This page should show a calendar view with all scheduled games, as well as filters to narrow down the schedule by team, field, or date range. A dashboard displaying the upcoming game schedule for the current user's team(s). This page will show a calendar view with all scheduled games, including date, time, location, and opponent information. Users can filter the schedule by team or date range. A dashboard displaying the upcoming game schedule for the entire league. This page will show all scheduled games, their dates, times, locations, and participating teams. Users can filter and sort the schedule based on various criteria.",
  },
  {
    path: '/schedules/create',
    description:
      'A form to create a new game schedule. This page should allow the league administrator to input teams, dates, times, fields, and any other relevant information. It should also provide options to automatically generate schedules based on predefined rules and team availability. A form for creating a new game schedule. Administrators and team captains can input details such as teams involved, date, time, location, and any special rules or notes. The scheduling logic will ensure that teams are not double-booked and that the schedule adheres to league rules. A form for administrators and authorized users to create a new game schedule. This page will allow users to input details such as the teams involved, date, time, location, and any other relevant information. It will also provide options to set availability constraints and apply league rules for scheduling.',
  },
  {
    path: '/settings/messaging',
    description:
      'A settings page where users can configure their direct messaging preferences, such as notification settings, message privacy options, and other messaging-related settings.',
  },
  {
    path: '/settings/scheduling',
    description:
      'A page for the league administrator to configure scheduling rules and preferences, such as game duration, field availability, and any other relevant settings that should be considered when generating schedules. A settings page for administrators to configure league scheduling rules, such as game duration, field availability, team availability constraints, and any other relevant scheduling parameters.',
  },
  {
    path: '/stats',
    description:
      "A dashboard displaying an overview of player statistics, including leaderboards for various categories such as goals, assists, and defensive plays. This page serves as a central hub for accessing more detailed player and team statistics and will provide a high-level view of the league's top performers.",
  },
  {
    path: '/stats/create',
    description:
      'A form for recording and submitting player statistics after a game. This page may include options for selecting the game, players involved, and various statistical categories to track.',
  },
  {
    path: '/stats/export',
    description:
      'A tool for administrators to export statistical data in various formats such as CSV, Excel, or JSON. This page will allow users to select the desired data range, teams, players, and other filters before exporting the data.',
  },
  {
    path: '/stats/games',
    description:
      'A list view of all games played in the league, displaying game scores, player statistics, and other relevant information. Users can filter and sort games based on different criteria. A list page displaying statistics for all games played in the league, with filters for season, team, and date range.',
  },
  {
    path: '/stats/import',
    description:
      "A tool for administrators to import historical statistical data from external sources or previous seasons. This page will provide options to map and transform the imported data to fit the league's data structure.",
  },
  {
    path: '/stats/leaderboards',
    description:
      'A page displaying leaderboards for various statistical categories, such as goals, assists, defensive plays, and more. Users can filter leaderboards by season, team, or other criteria.',
  },
  {
    path: '/stats/players',
    description:
      'A list view of all players in the league, displaying their key statistics and performance metrics. Users can filter and sort players based on different criteria. A list page displaying all players in the league, with sortable columns for different statistical categories. Users can filter and search for specific players.',
  },
  {
    path: '/stats/seasons',
    description:
      'A page listing all past and current seasons, with the ability to view season-specific statistics and leaderboards.',
  },
  {
    path: '/stats/settings',
    description:
      'A page for administrators to configure settings related to player statistics, such as which metrics to track, how to calculate certain statistics, and any league-specific rules or formulas. A page for configuring statistical tracking settings, such as which metrics to track, how to handle tie-breakers, and data retention policies.',
  },
  {
    path: '/stats/teams',
    description:
      'A list view of all teams in the league, displaying team statistics and performance metrics. Users can filter and sort teams based on different criteria. A list page showing team statistics, allowing users to compare team performance and view team leaderboards.',
  },
  {
    path: '/teams',
    description:
      'A list page displaying all teams in the league. This page will show basic information about each team, such as the team name, captain, and number of players. From this page, administrators and team captains can navigate to individual team pages or create a new team.',
  },
  {
    path: '/teams/create',
    description:
      'A form page for creating a new team. Administrators and team captains can enter the team name, select the team captain (if not creating as a captain), and optionally add initial players to the roster.',
  },
  {
    path: '/users',
    description:
      'A list of all registered users in the system, displaying basic information like username, role, and team affiliation (if applicable). This page allows users to search for and identify potential recipients for direct messages.',
  },
] as const;
