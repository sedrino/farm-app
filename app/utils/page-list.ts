export const pageDescriptions: {
  description: string;
  path: string;
}[] = [
  {
    path: "/billing",
    description:
      'This is the main billing dashboard for farm management, focusing on billing and invoicing for boarders. The page features a clean, organized layout with a navigation bar at the top and collapsible sections for easy viewing. Key elements include:\n\n- A summary of total outstanding balances and total revenue\n- A list of recent invoices with status (paid, unpaid, overdue)\n- Quick access to create new invoices via a "Generate New Invoice" button\n- Alerts for overdue payments\n- Filtering options by date range, boarder, or payment status\n- Options to view, edit, or send each invoice\n- A summary of outstanding payments and overdue invoices\n\nThe dashboard provides a comprehensive overview of all billing activities, allowing for efficient management of financial transactions related to farm operations and boarder services.',
  },
  {
    path: "/billing/invoices/$invoiceId",
    description:
      "This page displays details of a specific invoice and allows for editing if the invoice hasn't been sent. It shows:\n- Invoice number and date\n- Boarder information\n- Itemized list of charges\n- Subtotal, taxes, and total\n- Payment status\n- Options to edit, delete, or send the invoice\n- For sent invoices, it shows payment history\nThe layout is similar to a standard invoice format for easy reading. Edit options are prominently displayed for draft invoices, while sent invoices focus on payment status and history.\n",
  },
  {
    path: "/billing/invoices/create",
    description:
      "This page allows farm management to create new invoices. It includes:\n- A form to select the boarder from a dropdown list\n- Fields to add line items (description, quantity, unit price)\n- Automatic calculation of subtotal, taxes, and total\n- Option to add notes or special instructions\n- Ability to set due date\n- Preview option before finalizing\n- Button to save as draft or send immediately\nThe page has a clear, step-by-step layout guiding the user through the invoice creation process. It uses dynamic forms that update totals as items are added or modified.\n",
  },
  {
    path: "/billing/payments",
    description:
      "This page provides an overview of all payments received. It shows:\n- A list of recent payments with details (date, boarder, amount, method)\n- Filters for date range, boarder, and payment method\n- Option to manually record cash or check payments\n- Ability to issue refunds or adjust payments if needed\n- Summary statistics (total received, average payment, etc.)\nThe page uses a table layout for the payment list, with a summary card at the top for quick statistics. Action buttons allow for recording new payments or adjusting existing ones.\n",
  },
  {
    path: "/billing/reports",
    description:
      "This page allows farm management to generate and view financial reports related to billing. It includes:\n- Options to generate various report types (e.g., monthly income, outstanding balances, payment trends)\n- Date range selectors for report parameters\n- Ability to filter reports by boarder, service type, etc.\n- Preview of generated reports with charts and tables\n- Option to export reports as CSV or PDF\n- Scheduled report generation and email delivery setup\nThe page is divided into a report configuration section and a preview section. The configuration section uses forms and dropdowns to set report parameters, while the preview section displays the generated report with interactive charts and tables.\n",
  },
  {
    path: "/billing/settings",
    description:
      "This page allows farm management to configure billing settings and rates. It includes:\n- Setting default payment terms\n- Configuring tax rates\n- Defining standard service rates (e.g., boarding, additional services)\n- Setting up automatic billing for recurring charges\n- Configuring payment methods accepted\n- Setting up email templates for invoice notifications\nThe page is organized into sections for each group of settings, with a save button at the bottom of each section. It uses a combination of form inputs, toggles, and rich text editors for email templates.\n",
  },
  {
    path: "/boarder-management",
    description:
      "This is the main dashboard for Boarder Management. It provides an overview of all boarder-related activities and quick access to other boarder management features. The page includes:\n- A summary of total boarders\n- A list of recent activities (new boarders, contract updates, recent messages)\n- Quick links to create new boarder profiles, view contracts, and access the communication portal\n- A sidebar with navigation to other boarder management features\n",
  },
  {
    path: "/boarders",
    description:
      'This is the main Boarder Management dashboard providing an overview of all boarders and quick access to key features. The page includes:\n- A summary card showing the total number of boarders\n- A list of recent activities related to boarders (e.g., new boarders added, contracts updated)\n- Quick action buttons for adding a new boarder, generating invoices, and accessing the communication portal\n- A search bar to quickly find specific boarders\n- Filters to sort boarders by various criteria (e.g., contract status, length of stay)\n\nAdditionally, it displays a list of all boarders with:\n- A table view of boarders with columns for name, contact information, and current status\n- Sorting and filtering options\n- Action buttons for each boarder to view details, edit profile, or send a message\n- A "Create New Boarder" button at the top of the page',
  },
  {
    path: "/boarders/$boarderId",
    description:
      "This page displays a detailed profile for a specific boarder. It includes:\n- Personal information (name, contact details, emergency contact)\n- Associated horse(s) with links to their profiles\n- Current contract status and quick link to view/edit the contract\n- Billing information and payment history\n- Preferences and special notes\n- A timeline of important events (e.g., contract renewals, major communications)\n- Tabs or sections for easy navigation between different types of information\n- Action buttons for editing the profile, sending a message, or generating an invoice\n- Recent invoices\n- A timeline of recent activities and communications\n- Edit and Delete buttons for the profile",
  },
  {
    path: "/boarders/$boarderId/billing",
    description:
      "This page handles billing and invoicing for the boarder. It includes:\n- A summary of the boarder's current billing status\n- List of recent invoices with their status (paid, unpaid, overdue)\n- Ability to generate a new invoice\n- Option to set up recurring invoices\n- Payment history and transaction log\n- Action buttons to send reminders, process payments, or adjust billing details\n- Integration with payment gateways for online payment processing\n",
  },
  {
    path: "/boarders/$boarderId/contract",
    description:
      "This page manages the boarder's contract. It includes:\n- Current contract details with start and end dates\n- A full view of the contract terms and conditions\n- Option to generate a new contract or renew an existing one\n- Ability to upload signed contracts\n- A history of past contracts\n- Action buttons to edit, print, or email the contract\n- Integration with e-signature services for digital contract signing\n",
  },
  {
    path: "/boarders/$boarderId/edit",
    description:
      'This page allows for editing an existing boarder\'s profile. It includes:\n- Pre-filled form fields with the boarder\'s current information\n- Ability to update any field, including personal details, associated horses, and preferences\n- Option to upload new documents or photos\n- A section to view and edit contract details\n- Ability to update billing and payment information\n- "Save Changes" button to confirm changes\n- "Cancel" button to discard changes and return to the boarder\'s detail page\n- Form validation to ensure all required fields are filled correctly\n- A change history log to track updates made to the profile',
  },
  {
    path: "/boarders/$boarderId/invoices",
    description:
      "This page is accessible to both farm management and individual boarders. It shows:\n- A list of all invoices for the specific boarder\n- Filters for paid, unpaid, and overdue invoices\n- Quick view of invoice totals and due dates\n- Option to download invoices as PDF\n- For boarders: ability to make payments online\n- For management: ability to mark invoices as paid\nThe page has a clean table layout with sortable columns. Each row represents an invoice with expand/collapse functionality to show more details. Action buttons (e.g., pay, download) are available for each invoice.\n",
  },
  {
    path: "/boarders/create",
    description:
      'This page allows for the creation of a new boarder profile. It includes:\n- A comprehensive form with fields for all necessary boarder information (name, contact details, emergency contacts, preferences)\n- Ability to associate horses with the boarder\n- Option to upload documents or photos\n- A section to set up initial contract details\n- Billing and payment information setup\n- Form validation to ensure all required fields are filled correctly\n- A "Save" button to create the profile, and a "Cancel" button to discard changes\n- An option to create a contract for the new boarder upon saving',
  },
  {
    path: "/boarders/list",
    description:
      'This page displays a comprehensive list of all boarders. It includes:\n- A table view with columns for boarder name, associated horse(s), contract status, and contact information\n- Sortable columns for easy organization\n- A search function to quickly locate specific boarders\n- Filters to narrow down the list based on various criteria\n- Action buttons for each boarder to view profile, edit information, or send a message\n- A "Create New Boarder" button at the top of the page\n',
  },
  {
    path: "/bookings/$bookingId",
    description:
      "This page shows details of a specific booking. It includes:\n- All booking information (facility, date, time, duration, purpose, etc.)\n- Boarder information\n- Option to cancel the booking (if within cancellation policy)\n- For staff: ability to modify the booking\n- Add to Calendar button for users to add the booking to their personal calendar\nUsers can review all details of their booking and make changes if necessary.\n",
  },
  {
    path: "/bookings/$bookingId/edit",
    description:
      'This page allows users to edit an existing booking. It\'s similar to the create booking page but pre-filled with the current booking information. It includes:\n- All editable fields from the create booking form\n- Clear indication of which changes will incur fees or require approval\n- "Save Changes" button\n- "Cancel Edit" button to return to booking details without changes\nThe page ensures users understand the implications of their changes before submitting.\n',
  },
  {
    path: "/bookings/create",
    description:
      'This page allows users to create a new facility booking. It includes:\n- Dropdown to select the facility\n- Date and time picker for start and end times\n- Duration calculator\n- Purpose of booking field\n- Number of horses/people involved\n- Any special requirements or notes\n- Terms and conditions checkbox\n- "Submit Booking" button\nThe page dynamically updates available time slots based on the selected facility and date.\n',
  },
  {
    path: "/budget-planning",
    description:
      "This page is dedicated to creating and managing annual budgets. It includes:\n- Option to create a new budget or select an existing one\n- Table or spreadsheet-like interface for entering budget items\n- Ability to set planned income and expenses by category and month\n- Automatic calculation of totals and variances\n- Comparison view of budget vs actual figures (pulling data from income and expense entries)\n- Charts visualizing budget allocation and performance\n- Save and export options for budget plans\nThe interface should be intuitive, allowing easy data entry and real-time updates of calculations and visualizations.\n",
  },
  {
    path: "/categories",
    description:
      "This page allows users to manage categories for both income and expenses. It includes:\n- Separate tables for income and expense categories\n- Each table shows category name, description, and associated transactions count\n- Options to add, edit, or delete categories\n- Ability to set default categories\n- Option to merge categories\nThe page should have a simple, intuitive interface for easy category management. When attempting to delete a category with associated transactions, the user should be warned and given options to reassign those transactions.\n",
  },
  {
    path: "/communication",
    description:
      "This page serves as the communication portal for all boarders. It includes:\n- A message center with inbox, sent items, and archived messages\n- Ability to compose new messages to individual boarders or groups\n- Option to attach files or images to messages\n- Notification settings for new messages or important updates\n- A bulletin board for farm-wide announcements\n- Integration with email for sending notifications outside the system\n- Chat functionality for real-time communication with online users\n",
  },
  {
    path: "/communication-portal",
    description:
      'This is the main page for the Communication Portal feature. It includes:\n- A message board for farm-wide announcements\n- A list of recent messages or conversations with boarders\n- A "Compose New Message" button\n- Filtering options to view messages by boarder or topic\n- Notification settings for new messages or announcements\n',
  },
  {
    path: "/communication-portal/announcements",
    description:
      "This page allows farm management to create and manage announcements. It includes:\n- A list of all past announcements\n- A form to create new announcements with rich text editing\n- Options to schedule announcements for future dates\n- Ability to target announcements to specific groups of boarders\n- Analytics on announcement views and responses\n",
  },
  {
    path: "/communication-portal/messages/$messageId",
    description:
      "This page displays an individual message thread. It includes:\n- The full conversation history\n- Participant information (farm management and boarder)\n- A text area to reply to the message\n- Options to add attachments or photos\n- Buttons to close, archive, or flag the conversation\n",
  },
  {
    path: "/contracts",
    description:
      'This is the main contracts dashboard page, managing all boarding contracts. It provides an overview of active and pending contracts, with quick access to contract-related actions. The page includes:\n- A summary section showing total number of active contracts, contracts expiring soon, and pending contracts\n- A "Create New Contract" button for quick action\n- A search bar to find specific contracts\n- A filterable and sortable table of contracts, displaying key information such as boarder name, contract start date, end date, and status\n- Table actions to view details, edit, or terminate contracts\n- Sorting and filtering options for the contract list\n- A sidebar with links to contract templates and reports',
  },
  {
    path: "/contracts/$contractId",
    description:
      "This page displays comprehensive details of a specific contract. It includes:\n- All contract information, terms, and conditions in a readable format\n- Associated boarder and horse information\n- Contract start and end dates\n- Payment terms and history\n- A sidebar with quick actions:\n  - Edit contract\n  - Terminate contract\n  - Renew contract\n  - Generate invoice (linked to Billing and Invoicing feature)\n  - Send message to boarder (linked to Communication Portal feature)\n- A timeline of contract events (creation, modifications, renewals)\n- A section for attached documents or related files\n- A comments or notes section for internal use\n- Options to download a PDF version of the contract\n- A timeline of contract events (creation, modifications, renewals)",
  },
  {
    path: "/contracts/$contractId/edit",
    description:
      "This page allows users to edit an existing contract. It includes:\n- A pre-filled form with all current contract details, similar to the create page\n- Options to modify any contract terms or conditions\n- A document comparison view showing changes from the original contract\n- Save changes and Cancel buttons\n- A warning message if changes will affect billing or invoicing\n",
  },
  {
    path: "/contracts/create",
    description:
      "This page allows users to create a new boarding contract. It includes:\n- A form with fields for all necessary contract details, such as:\n  - Boarder selection (dropdown or search, linked to Boarder Profiles)\n  - Contract start and end dates\n  - Horse(s) covered by the contract (linked to Horse Profiles)\n  - Boarding fees and payment terms\n  - Additional services and their costs\n  - Special conditions or requirements\n- An option to use a pre-defined contract template\n- A document preview section showing the contract as it's being created\n- Save as draft and Submit buttons\n- Upon submission, the user is redirected to the contract detail page\n",
  },
  {
    path: "/contracts/reports",
    description:
      "This page allows users to generate and view reports related to contracts. It includes:\n- Options to generate various reports such as:\n  - Contracts expiring soon\n  - Revenue projections based on current contracts\n  - Contract renewal rates\n- Filters for date ranges, contract types, or specific boarders\n- Export options for reports (PDF, CSV, etc.)\n- A dashboard of key contract-related metrics and charts\n",
  },
  {
    path: "/contracts/templates",
    description:
      "This page manages contract templates for quick and consistent contract creation. It includes:\n- A list of existing contract templates\n- Options to create, edit, or delete templates\n- A preview function for each template\n- Ability to set a default template for new contracts\n",
  },
  {
    path: "/events",
    description:
      "This is the main Event Management dashboard. It provides an overview of all event-related activities on the farm. The page includes:\n- A summary of upcoming events and facility bookings\n- Quick access buttons to create new bookings, events, or add visitors\n- A mini-calendar widget showing the next 7 days of events\n- Recent activity feed showing latest bookings, visitor check-ins, and entries\n- Key statistics such as total events this month, most popular facilities, and busiest days\n- Links to other event management features including the full calendar and visitor management system\n- A section highlighting recent event reports or statistics\n\nUsers can navigate to more detailed views and other event-related pages from this central hub. The layout is clean and intuitive, with card-based UI components for each section.",
  },
  {
    path: "/events/$eventId",
    description:
      "This page displays detailed information about a specific event. It includes:\n- Event name, date, time, and location (facility)\n- Event description and any special instructions\n- A map or diagram of the facility location\n- List of participants or attendees with contact information\n- Option to edit the event details or delete the event\n- Ability to cancel or reschedule the event\n- Button to duplicate the event for easy rescheduling\n- Comments or notes section\n- Related documents (e.g., waivers, schedules)\n- Quick link to generate a report for this specific event\n\nFor recurring events, it shows the recurrence pattern and allows managing the entire series or individual occurrences. The layout should be clear and informative, with all relevant event details easily accessible.",
  },
  {
    path: "/events/$eventId/edit",
    description:
      "This page allows editing of an existing event, pre-populated with the event's current information. Features include:\n- Option to update just this occurrence or the entire series for recurring events\n- Ability to change the event type or location, with warnings if it conflicts with existing bookings\n- Option to notify participants of any changes\n- Cancel/Reschedule options\n- Ability to view the event's history (e.g., past edits, cancellations)\n- Option to duplicate the event for easy creation of similar events\n\nThe layout should clearly show what information is being edited, with options to cancel edits or revert to the original information.",
  },
  {
    path: "/events/bookings/$bookingId",
    description:
      "This page displays details of a specific facility booking. It shows:\n- Facility booked\n- Date, time, and duration of the booking\n- Boarder who made the booking\n- Purpose of the booking\n- Any additional notes\n- Options to edit or cancel the booking\n- For staff, an option to approve or deny the booking request\n",
  },
  {
    path: "/events/bookings/create",
    description:
      "This page allows boarders to create new facility bookings. It includes:\n- A form to select the desired facility (arena, round pen, etc.)\n- Date and time selection for the booking\n- Duration of the booking\n- Purpose of the booking (training, exercise, etc.)\n- Any additional notes or requirements\n- Submit button to create the booking\n- Clear form option\n",
  },
  {
    path: "/events/calendar",
    description:
      'This page displays a comprehensive, full-screen calendar view of all farm events, facility bookings, clinics, and important dates. Features include:\n- Monthly, weekly, and daily view options\n- Color-coded events based on type (e.g., facility bookings, clinics, maintenance, private bookings)\n- Ability to filter events by facility, event type, boarder, or participant\n- Quick-view popups or hover details for event information\n- Click on an event or date to view more details or edit\n- "Add Event" or "Add Booking" button to quickly create new entries\n- Interactive drag-and-drop functionality for easy rescheduling\n- Option to export the calendar\n- Easy navigation between dates, months, and years\n- Comprehensive view of all farm activities and bookings\n\nUsers can easily manage and view all farm-related events, making it a central hub for scheduling and planning.',
  },
  {
    path: "/events/create",
    description:
      "This page allows users to create a new event. It features a comprehensive form with fields for:\n- Event title/name\n- Event type (dropdown: clinic, maintenance, private booking, etc.)\n- Start date and time\n- End date and time\n- Location/Facility (dropdown of available facilities)\n- Description\n- Participants (searchable input for boarders, staff, or visitors)\n- Participant limit (if applicable)\n- Recurring event options\n- Associated costs or fees\n- Attachments/Upload option for related documents\n- Notification settings for boarders\n\nThe page includes a small calendar widget to help with date selection. The form is designed to be intuitive, with smart defaults and validation to ensure all necessary information is captured. Upon submission, the event is added to the main calendar.",
  },
  {
    path: "/events/farm-events/$eventId",
    description:
      "This page displays details of a specific farm event or clinic. It shows:\n- Event name and description\n- Date, time, and duration\n- Location on the farm\n- Number of registered participants and maximum capacity\n- Registration status (open, closed, waitlist)\n- Options for boarders to register or cancel registration\n- For staff, options to edit or cancel the event\n",
  },
  {
    path: "/events/farm-events/create",
    description:
      "This page allows farm staff to create new farm events or clinics. It includes:\n- Event name and description fields\n- Date and time selection\n- Duration of the event\n- Location on the farm\n- Maximum number of participants (if applicable)\n- Registration requirements or fees\n- Option to make the event public or private\n- Submit button to create the event\n",
  },
  {
    path: "/events/reports",
    description:
      "This page is the central hub for event reporting and analysis. It offers a comprehensive set of features including:\n\n- A dashboard displaying key metrics and interactive charts (e.g., most popular facilities, busiest times)\n- Options to generate various report types:\n  * Facility usage reports\n  * Event participation reports\n  * Visitor logs\n  * Revenue reports from paid events\n  * Comparison reports (month-over-month, year-over-year)\n- Date range selection for customizing report periods\n- Advanced filtering options for facilities, event types, visitor categories, or participants\n- A 'Generate Report' button to create reports based on selected criteria\n- Display area for viewing generated reports with interactive charts and tables\n- Ability to drill down into specific data points for detailed analysis\n- Export functionality supporting multiple formats (PDF, CSV, Excel)\n- Option to save report configurations for future use\n- Scheduled report generation and email distribution capabilities\n\nThe page layout is designed to be clean, data-focused, and user-friendly, emphasizing ease of use in generating, viewing, and analyzing event-related data.",
  },
  {
    path: "/expenses",
    description:
      'This page provides a comprehensive view of all farm expenses. It includes:\n- A filterable and sortable table of all expense entries, with options to edit or delete existing entries directly from the table\n- Total expenses for the selected period\n- Breakdown of expenses by category (e.g., feed, utilities, maintenance)\n- A pie chart showing the distribution of expenses by category\n- Chart showing expense trends over time\n- Filters to view expenses by date range, category, vendor, or amount\n- A summary of total expenses for the selected period\n- A "New Expense Entry" button that opens the expense entry form\n- Action buttons to export data and generate reports\nUsers can click on any expense in the table to view its details. The layout and functionality should be consistent with the income page for a unified user experience.',
  },
  {
    path: "/expenses/$expenseId",
    description:
      "This page displays detailed information about a specific expense entry. It shows all the information entered when the expense was created, including:\n- Date of expense\n- Amount\n- Category\n- Vendor/Payee\n- Description\n- Payment method\n- Associated receipt (if uploaded)\n- Tags\nThe page should also include options to edit the expense, delete it, or mark it as reconciled. There should be navigation options to easily move to the next or previous expense entry.\n",
  },
  {
    path: "/expenses/$expenseId/edit",
    description:
      "This page allows users to edit an existing expense entry. It's similar to the create page but pre-populated with the current expense data. The form should include:\n- Date of expense\n- Amount\n- Category (dropdown with predefined categories)\n- Vendor/Payee\n- Description\n- Payment method\n- Option to view or replace the uploaded receipt\n- Tags\nThe form should have the same validation as the create form. After successful edit, users should be redirected back to the expense details page.\n",
  },
  {
    path: "/expenses/create",
    description:
      "This page allows users to add a new expense entry. It includes a form with the following fields:\n- Date of expense\n- Amount\n- Category (dropdown with predefined categories)\n- Vendor/Payee\n- Description\n- Payment method\n- Receipt upload option\n- Tags for additional categorization\nThe form should have validation to ensure all required fields are filled and the amount is a valid number. After submission, users should be redirected to the expense details page for the newly created entry.\n",
  },
  {
    path: "/facilities",
    description:
      'This page manages facility bookings and lists all facilities available. It includes:\n- A table view of all facilities with columns for name, type, capacity, and current availability\n- Filters to sort and search facilities\n- A "Book Now" button next to each facility\n- Option to view facility details\n- Calendar view of each facility\'s availability\n- Quick view of upcoming bookings for each facility\n- Ability to book a facility directly from this page\n- For staff: ability to add new facilities, edit existing ones, and set facility maintenance times\nUsers can quickly see which facilities are available, view more details, and proceed to book them. The page provides both list and calendar views for easy management of facility bookings.',
  },
  {
    path: "/facilities/$facilityId",
    description:
      'This page displays detailed information about a specific facility. It includes:\n- All facility details (name, type, capacity, description, amenities)\n- Photo gallery\n- Calendar showing availability for the next 30 days\n- "Book Now" button to create a new booking\n- For staff: "Edit Facility" button\n- List of upcoming bookings for this facility\nUsers can get all necessary information about a facility and proceed to book it.\n',
  },
  {
    path: "/facilities/booking",
    description:
      "This page allows boarders to reserve shared facilities like arenas or round pens. It includes:\n- A list or grid view of all available facilities\n- A calendar for each facility showing availability\n- A booking form to reserve a facility for a specific date and time\n- Options to set recurring bookings\n- A section showing the user's upcoming and past bookings\n- Ability to cancel or modify existing bookings\n\nThe page should have a user-friendly interface with clear availability indicators and an easy booking process.\n",
  },
  {
    path: "/facilities/create",
    description:
      "This page allows staff to add a new facility to the system. It includes a form with fields for:\n- Facility name\n- Type (e.g., arena, round pen, trail course)\n- Capacity\n- Description\n- Amenities\n- Booking rules (e.g., max duration, advance notice required)\n- Upload area for facility photos\nStaff can create comprehensive facility profiles to inform boarders.\n",
  },
  {
    path: "/farm-operations",
    description:
      "This is the main Farm Operations dashboard. It provides an overview of all farm operation activities, including:\n- Current inventory levels with low stock alerts\n- Today's staff schedule and upcoming shifts\n- Recent maintenance requests\n- Current pasture rotation status and upcoming rotations\n\nThe page features a navigation menu for quick access to specific farm operation areas and detailed pages. It also displays important notifications or alerts related to farm operations. A search bar is included for quick access to specific information across all farm operation areas.",
  },
  {
    path: "/farm-operations/inventory",
    description:
      "This page serves as the main dashboard for inventory management. It displays an overview of the current inventory status, including:\n- Total number of inventory items\n- Quick view of low stock items\n- Graph showing inventory value over time\n- Recent inventory activities (additions, depletions, adjustments)\n- Quick access buttons to add new items, generate reports, and view categories\n\nThe page has a search bar at the top to quickly find specific items. Below the overview section, there's a table listing all inventory items with columns for item name, category, current quantity, unit of measure, and last updated date. The table has sorting and filtering capabilities.\n",
  },
  {
    path: "/farm-operations/inventory/categories",
    description:
      "This page manages inventory categories and subcategories. It includes:\n- A hierarchical view of all categories and subcategories\n- Ability to add, edit, or delete categories\n- Option to move items between categories\n- Quick view of how many items are in each category\n- Search and filter functions to find specific categories or items\n\nThe page allows for drag-and-drop reorganization of the category structure and includes a confirmation dialog for actions that affect multiple items.\n",
  },
  {
    path: "/farm-operations/inventory/items",
    description:
      'This page provides a detailed list view of all inventory items. It includes:\n- A table with columns for item name, category, current quantity, unit of measure, reorder point, supplier, and last updated date\n- Sorting and filtering options for each column\n- A search bar for quick item lookup\n- Action buttons for each item (edit, delete, adjust quantity)\n- Bulk action options (e.g., export selected, delete selected)\n- Pagination controls\n\nAt the top of the page, there\'s an "Add New Item" button that leads to the item creation page.\n',
  },
  {
    path: "/farm-operations/inventory/items/$itemId",
    description:
      "This page displays detailed information about a specific inventory item. It includes:\n- Item name, description, and image (if available)\n- Current quantity and unit of measure\n- Category and subcategory\n- Reorder point and preferred supplier\n- Usage history graph\n- Recent transactions log (additions, depletions, adjustments)\n- Related items or suggested alternatives\n\nThe page has action buttons for editing the item, adjusting quantity, and deleting the item. There's also a section for notes or special instructions related to the item.\n",
  },
  {
    path: "/farm-operations/inventory/items/$itemId/edit",
    description:
      'This page allows users to edit an existing inventory item. It\'s similar to the create page but pre-populated with the item\'s current information. It includes:\n- All fields from the create page\n- Additional fields for last stock check date and notes\n- Option to view and edit the item\'s transaction history\n\nThe page has "Save Changes" and "Cancel" buttons. There\'s also a "Duplicate Item" option to create a new item based on the current one.\n',
  },
  {
    path: "/farm-operations/inventory/items/create",
    description:
      'This page allows users to add a new inventory item. It contains a form with fields for:\n- Item name and description\n- Category and subcategory (with option to add new categories)\n- Initial quantity and unit of measure\n- Reorder point\n- Preferred supplier (with option to add new supplier)\n- Cost per unit\n- Storage location\n- Image upload\n\nThe page includes a "Save" button to create the item and a "Cancel" button to return to the inventory list. There\'s also an option to "Save and Add Another" for quickly adding multiple items.\n',
  },
  {
    path: "/farm-operations/inventory/reports",
    description:
      "This page allows users to generate and view various inventory reports. It includes:\n- A list of pre-defined report types (e.g., Current Stock Levels, Low Stock Items, Inventory Value, Usage Trends)\n- Options to customize report parameters (date range, categories, specific items)\n- Preview of the selected report\n- Export options (PDF, CSV, Excel)\n- Ability to save custom report configurations for future use\n\nThe page also displays a history of recently generated reports for quick access.\n",
  },
  {
    path: "/farm-operations/inventory/suppliers",
    description:
      "This page manages supplier information related to inventory. It includes:\n- A table listing all suppliers with columns for name, contact information, associated items, and last order date\n- Action buttons to edit or delete supplier information\n- A form to add new suppliers\n- Option to associate suppliers with specific inventory items\n- Quick view of recent orders or transactions with each supplier\n\nThe page also has a search function and filtering options to easily find specific suppliers or items.\n",
  },
  {
    path: "/farm-operations/my-schedule",
    description:
      'This page is for individual staff members to view their own schedules. It includes:\n- The staff member\'s name and role at the top of the page\n- A monthly calendar view showing their scheduled shifts\n- A list view of upcoming shifts with dates, times, and assigned tasks\n- An option to request time off or shift changes\n- A "Print Schedule" button to generate a printable version of their schedule\n',
  },
  {
    path: "/farm-operations/schedules/$scheduleId/edit",
    description:
      'This page allows for editing an existing schedule. It includes:\n- The current schedule displayed in a calendar view\n- Options to add, remove, or modify shifts\n- A staff list sidebar showing available staff members\n- Drag-and-drop functionality to reassign shifts\n- A "Save Changes" button to update the schedule\n- A "Cancel" button to discard changes and return to the main scheduling dashboard\n',
  },
  {
    path: "/farm-operations/schedules/create",
    description:
      'This page is for creating new work schedules. It includes:\n- A date range selector for the schedule period\n- A drag-and-drop interface to assign staff to shifts\n- Options to set shift times and repeat patterns (e.g., weekly, bi-weekly)\n- A staff list sidebar showing available staff members\n- A "Save Schedule" button to finalize and implement the new schedule\n- A "Cancel" button to discard changes and return to the main scheduling dashboard\n',
  },
  {
    path: "/farm-operations/staff",
    description:
      'This page displays a list of all staff members. It includes:\n- A table with columns for name, role, contact information, and current status (active/inactive)\n- A search bar to filter staff members\n- An "Add New Staff Member" button that leads to the staff creation page\n- Edit and Delete actions for each staff member in the table\n- Clicking on a staff member\'s name leads to their individual schedule page\n',
  },
  {
    path: "/farm-operations/staff-scheduling",
    description:
      'This is the main staff scheduling dashboard. It provides an overview of the current week\'s schedule, showing all staff members and their assigned shifts. The page includes:\n- A weekly calendar view with staff names and shift times\n- Quick filters to view schedules by role (e.g., handlers, maintenance staff)\n- A "Create New Schedule" button that leads to the schedule creation page\n- An "Edit Schedule" button that becomes active when a shift is selected\n- A "View All Staff" button that leads to the staff list page\n- A date picker to navigate to different weeks\n- A "Generate Report" button to create schedule reports\n',
  },
  {
    path: "/farm-operations/staff/$staffId",
    description:
      'This page displays the individual schedule for a specific staff member. It includes:\n- The staff member\'s name and role at the top of the page\n- A monthly calendar view showing their scheduled shifts\n- A list view of upcoming shifts with dates, times, and assigned tasks\n- An "Edit Profile" button that leads to the staff edit page\n- An "Assign Shift" button that opens a modal to quickly assign a new shift\n',
  },
  {
    path: "/farm-operations/staff/$staffId/edit",
    description:
      "This page allows editing of a staff member's profile. It includes:\n- Pre-filled form fields with the staff member's current information\n- Options to update name, role, contact information, emergency contact, and availability preferences\n- A \"Save Changes\" button to update the staff member's information\n- A \"Cancel\" button to return to the staff member's individual schedule page\n",
  },
  {
    path: "/farm-operations/staff/create",
    description:
      'This page allows for the creation of a new staff member profile. It includes:\n- Form fields for name, role, contact information, emergency contact, and availability preferences\n- A "Save" button to create the new staff member\n- A "Cancel" button to return to the staff list page\n',
  },
  {
    path: "/finance",
    description:
      "This is the main financial dashboard for the farm. It provides an overview of the farm's financial health, including:\n- Total income and expenses for the current month and year-to-date\n- Quick view of the most recent transactions (both income and expenses)\n- Chart showing income vs expenses over time\n- Links to generate common financial reports\n- Alert section for any budget overruns or upcoming payment due dates\n\nThe page has a clean, easy-to-read layout with cards for each section. Users can click on any section to drill down into more detailed information.\n",
  },
  {
    path: "/finance/budgets",
    description:
      "This page is for managing farm budgets:\n- List of existing budgets (e.g., annual, quarterly, project-specific)\n- Option to create a new budget\n- Summary view of budget vs actual spending for each budget\n- Alerts for any categories exceeding budget limits\n",
  },
  {
    path: "/finance/budgets/$budgetId",
    description:
      "Detailed view of a specific budget:\n- Breakdown of planned vs actual spending by category\n- Progress bars or charts showing budget utilization\n- Ability to adjust budget allocations\n- Option to add notes or justifications for budget changes\n- Comparison with previous period's budget if applicable\n",
  },
  {
    path: "/finance/budgets/create",
    description:
      "Page for creating a new budget:\n- Form to input budget details (name, time period, categories)\n- Ability to set planned amounts for each expense category\n- Option to base new budget on previous budgets or actual spending\n- Preview of budget allocations with a pie chart\n",
  },
  {
    path: "/finance/expenses",
    description:
      "Similar to the income page, this page shows all expense transactions:\n- Sortable and filterable table of expense transactions\n- Each row displays date, vendor, category, and amount\n- Functionality to add a new expense\n- Option to edit or delete existing transactions\n- Summary statistics showing total expenses for various time periods\n- Ability to upload receipts for each transaction\n- Export functionality for data download\n",
  },
  {
    path: "/finance/income",
    description:
      "This page displays a list of all income transactions. Features include:\n- Sortable and filterable table of income transactions\n- Each row shows date, source, category, and amount\n- Ability to add a new income transaction\n- Option to edit or delete existing transactions\n- Summary statistics at the top showing total income for different time periods\n- Export functionality to download the data as CSV or Excel file\n",
  },
  {
    path: "/finance/reports",
    description:
      "This is the central hub for financial reporting. It includes:\n- A list of pre-defined report types (e.g., Profit & Loss, Cash Flow, Balance Sheet)\n- Option to select date range for each report\n- Ability to generate and view reports in-browser\n- Functionality to download reports in various formats (PDF, Excel)\n- Option to schedule regular report generation and email distribution\n- Custom report builder for advanced users\n- Comparison feature to view reports side-by-side for different time periods\n",
  },
  {
    path: "/finance/reports/$reportId",
    description:
      "This page displays a specific financial report:\n- Detailed view of the selected report\n- Interactive charts and graphs where applicable\n- Option to adjust date ranges and regenerate the report\n- Ability to drill down into specific line items for more detail\n- Export options (PDF, Excel, CSV)\n- Sharing functionality to send the report to other users or stakeholders\n",
  },
  {
    path: "/finance/reports/create",
    description:
      "This page allows users to create custom financial reports:\n- Selection of data points to include in the report\n- Options for grouping and summarizing data\n- Preview of the report as it's being built\n- Ability to save custom report templates for future use\n- Option to schedule recurring generation of the custom report\n",
  },
  {
    path: "/financial-dashboard",
    description:
      "This is the main financial dashboard page. It provides an overview of the farm's financial health, including:\n- Total income and expenses for the current month and year-to-date\n- Net profit/loss for the current month and year-to-date\n- Quick comparison of actual vs. budgeted amounts\n- Recent transactions list (both income and expenses)\n- Charts showing income vs expenses over time and trends\n- Quick links to add new income or expense entries, view reports, and manage budgets\n- Alerts for upcoming bills or overdue payments\nThe page should have a clean, easy-to-read layout with cards for each section and use charts and graphs where appropriate to visualize data.",
  },
  {
    path: "/financial-management",
    description:
      "This is the main Financial Management dashboard. It provides an overview of the farm's financial health, including:\n- Summary of total income and expenses\n- Quick view of the current month's budget status\n- Graphical representation of income vs expenses over time\n- Links to create new income or expense entries\n- Links to access detailed reports, budget planning, and other financial management features\nThe page should have a clean, easy-to-read layout with cards or sections for each main piece of information. It should also include quick action buttons for common tasks like adding new income or expenses.\n",
  },
  {
    path: "/financial-management/budget",
    description:
      "This is the main Budget Planning page. It includes:\n- An overview of the current year's budget\n- Ability to create a new annual budget\n- List of past budgets\n- Comparison of actual spending vs. budgeted amounts\n- Visual representations of budget allocation across categories\n- Links to edit the current budget or view detailed budget breakdowns\nThe page should have an intuitive interface for creating and managing budgets, with clear visualizations of budget data.\n",
  },
  {
    path: "/financial-management/budget/$budgetId",
    description:
      "This page displays details for a specific budget. It includes:\n- Overview of the budget year and total amount\n- Breakdown of allocations by category\n- Monthly view of planned expenses\n- Comparison of actual spending vs. budgeted amounts (if it's the current year)\n- Options to edit the budget or create a new budget based on this one\n- Visualizations of budget allocation and spending patterns\nThe page should provide a comprehensive view of the budget with easy-to-understand charts and tables.\n",
  },
  {
    path: "/financial-management/budget/$budgetId/edit",
    description:
      'This page allows editing of an existing budget. It includes:\n- Form pre-filled with the current budget data\n- Ability to adjust overall budget amount\n- Interface to modify allocations to different expense categories\n- Option to adjust monthly allocations\n- Real-time calculation of changes and their impact\n- "Save Changes" and "Cancel" buttons\nThe page should have a dynamic interface similar to the budget creation page, allowing for easy adjustments and providing immediate feedback on changes.\n',
  },
  {
    path: "/financial-management/budget/create",
    description:
      'This page is for creating a new annual budget. It includes:\n- Form to set the budget year and overall budget amount\n- Interface to allocate budget amounts to different expense categories\n- Ability to set monthly allocations for each category\n- Option to copy structure from a previous year\'s budget\n- Real-time calculation of remaining unallocated funds\n- "Save Draft" and "Finalize Budget" buttons\nThe page should have a dynamic, user-friendly interface that allows for easy adjustment of budget allocations and provides immediate feedback on the budget balance.\n',
  },
  {
    path: "/financial-management/categories",
    description:
      "This page is for managing income and expense categories. It includes:\n- Separate sections for income and expense categories\n- List of existing categories for each type\n- Ability to add new categories\n- Option to edit or delete existing categories\n- Indication of which categories are in use and cannot be deleted\n- Ability to set default categories for common income or expense types\nThe page should have a clean, organized layout with clear separation between income and expense categories, and intuitive controls for managing them.\n",
  },
  {
    path: "/financial-management/expenses",
    description:
      'This page is for tracking and managing expenses. It includes:\n- A table listing all expense entries, sortable by date, category, and amount\n- Ability to filter expenses by date range, category, or vendor\n- A "Create New Expense Entry" button\n- Option to edit or delete existing entries directly from the table\n- A summary section showing total expenses for the selected period\n- Ability to export the expense data as a CSV or PDF\nThe page should have a search function to quickly find specific entries and a clear, intuitive interface for adding and managing expense data.\n',
  },
  {
    path: "/financial-management/expenses/create",
    description:
      'This page allows users to create a new expense entry. It includes:\n- A form with fields for date, amount, category, vendor, and description\n- Dropdown menu for selecting predefined expense categories\n- Option to add a new category if needed\n- Ability to attach receipts or other relevant documents\n- "Save" and "Cancel" buttons\nThe form should use input validation to ensure all required fields are filled and the data is in the correct format.\n',
  },
  {
    path: "/financial-management/income",
    description:
      'This page is for tracking and managing income. It includes:\n- A table listing all income entries, sortable by date, category, and amount\n- Ability to filter entries by date range, category, or source\n- A "Create New Income Entry" button\n- Option to edit or delete existing entries directly from the table\n- A summary section showing total income for the selected period\n- Ability to export the income data as a CSV or PDF\nThe page should have a search function to quickly find specific entries and a clear, intuitive interface for adding and managing income data.\n',
  },
  {
    path: "/financial-management/income/create",
    description:
      'This page allows users to create a new income entry. It includes:\n- A form with fields for date, amount, category, source, and description\n- Dropdown menu for selecting predefined income categories\n- Option to add a new category if needed\n- Ability to attach receipts or other relevant documents\n- "Save" and "Cancel" buttons\nThe form should use input validation to ensure all required fields are filled and the data is in the correct format.\n',
  },
  {
    path: "/financial-management/reports",
    description:
      "This page is for generating and viewing financial reports. It includes:\n- Options to generate different types of reports (e.g., profit and loss, cash flow analysis)\n- Date range selector for report generation\n- Ability to customize report parameters\n- Preview of generated reports\n- Options to print, download as PDF, or export to spreadsheet format\n- Saved reports section for quick access to frequently used reports\nThe page should have a user-friendly interface for selecting report types and parameters, with clear visualizations of the generated reports.\n",
  },
  {
    path: "/financial-reports",
    description:
      "This page allows users to generate and view various financial reports. It includes:\n- Options to select report type (e.g., Profit & Loss, Cash Flow, Income Statement)\n- Date range selector for the report period\n- Filters for specific categories or sources\n- Generate button to create the report\n- Display area for the generated report with options to print or export to PDF/Excel\n- Saved reports section where users can access previously generated reports\nThe page should have a clean, professional layout with clear instructions on how to generate reports.\n",
  },
  {
    path: "/horses",
    description:
      'This is the main Horse Management dashboard, providing a comprehensive overview of all horses in the farm. The page includes:\n\n- Summary statistics showing total number of horses, horses requiring attention (e.g., upcoming vaccinations, special needs), and quick stats on feeding schedules (e.g., horses fed today, upcoming feedings).\n- Recent health updates and exercise/training logs.\n- A searchable and sortable table listing all horses with columns for name, breed, age, stall number, and status (e.g., healthy, needs attention).\n- Quick action buttons for each horse to view profile, edit details, or log health/exercise information.\n- Filters to sort horses by various criteria such as breed, age range, or special needs.\n- A prominent "Add New Horse" button at the top of the page.\n- A search bar to quickly find specific horses.\n- A navigation menu for easy access to other horse management features.\n\nMain actions available:\n- Add new horse (button that leads to the create horse page)\n- View all horses (button that leads to the horse list page)\n- Quick links to recently viewed or updated horse profiles\n\nUsers can click on a horse\'s name to view its detailed profile. The page serves as a central hub for managing all aspects of horse care and information in the farm.',
  },
  {
    path: "/horses/$horseId",
    description:
      "This page displays comprehensive information about a specific horse. It includes:\n\n1. Basic Information:\n   - Horse's name, breed, age, owner\n   - Profile photo and additional images\n   - Current stall assignment\n   - Special care instructions\n\n2. Health:\n   - Recent health logs and updates\n   - Vaccination history and status\n   - Upcoming medical needs\n   - Quick access to full health history\n\n3. Feeding:\n   - Current feeding schedule\n   - Dietary requirements\n   - Option to modify schedule\n\n4. Exercise & Training:\n   - Recent exercise and training logs\n   - Training progress\n   - Option to view all logs or add new entries\n\n5. Documents:\n   - Access to uploaded documents\n   - Additional photos\n\nThe page is organized into clearly defined sections for easy navigation. Each section includes:\n   - Relevant information summaries\n   - Quick action buttons (e.g., edit, add new entry)\n   - 'View More' or 'Manage' buttons for detailed information\n\nMain actions available:\n   - Edit horse profile\n   - Log health information\n   - Update feeding schedule\n   - Record exercise/training session\n   - Delete horse profile (with confirmation)\n\nThe layout includes a header with key details and either a sidebar or footer showing the assigned stall and any special care instructions. The design emphasizes quick access to information and easy management of the horse's care.",
  },
  {
    path: "/horses/$horseId/edit",
    description:
      "This page allows editing of an existing horse's profile. It's similar to the create page but pre-populated with the horse's current information. The page includes:\n\n- All editable fields from the create form, such as name, breed, date of birth/age, gender, color, markings, owner information, stall assignment, and special needs or requirements\n- Option to update the horse's photos, including adding, removing, or reordering them\n- Ability to add or remove documents\n- A 'Save Changes' button to update the profile\n- A 'Cancel' button to return to the horse's profile without saving changes\n- A confirmation prompt if the user attempts to leave the page with unsaved changes\n- A 'Delete Horse' button with appropriate warnings and confirmations\n- Form validation to ensure all required fields are filled\n\nUpon successful submission, the user is redirected back to the horse's profile page with a success message.",
  },
  {
    path: "/horses/$horseId/exercise",
    description:
      "This page is dedicated to logging, tracking, and viewing exercise and training for a specific horse. It includes:\n- A form to log new exercise or training sessions, with fields for:\n  * Date and duration\n  * Type of exercise or training\n  * Intensity level\n  * Notes on performance or behavior\n- Calendar view showing past and scheduled future sessions\n- Table or list view of all logged sessions, sortable by date, type, and duration\n- Graphs or charts showing exercise trends over time\n- Ability to set and track training goals\n- Quick link to update exercise preferences or limitations in the main horse profile\n- Summary statistics like total exercise time this week/month, types of exercises performed, and progress indicators\n\nUsers can:\n- Log new exercise or training sessions\n- View details of past sessions\n- Edit or delete existing sessions\n- Schedule future sessions\n\nThe page offers both calendar and list views for easy navigation and review of exercise history.",
  },
  {
    path: "/horses/$horseId/exercise-logs",
    description:
      'This page is dedicated to exercise and training logs for the specific horse. It displays a list of recent logs, each showing the date, type of exercise/training, duration, and a brief summary. Users can click on a log to view full details. The page has an "Add New Log" button prominently displayed. There\'s also a calendar view toggle, allowing users to see logs displayed on a monthly calendar. The page includes filters for log type, date range, and trainer. A summary section at the top shows stats like total exercise time this month, most frequent activities, and any notable achievements.\n',
  },
  {
    path: "/horses/$horseId/exercise-logs/create",
    description:
      'This page provides a form to create a new exercise or training log. Fields include date, start time, end time, type of exercise/training (e.g., lunging, riding, groundwork), intensity level, trainer/rider name, and a detailed description area. There\'s also an option to upload photos or videos from the session. Users can add specific goals for the session and note any achievements. The form includes a section for recording the horse\'s behavior and any areas for improvement. "Save" and "Cancel" buttons are at the bottom, with "Save" adding the new log and returning to the exercise logs list.\n',
  },
  {
    path: "/horses/$horseId/feeding",
    description:
      "This page manages the feeding schedule for an individual horse. It displays a weekly calendar view showing the current feeding regimen, including types of feed, quantities, and feeding times. Users can add, edit, or remove feeding times and details. The page includes:\n\n- A form to specify types and amounts of feed, supplements, and any special instructions\n- Option to set different schedules for different days of the week\n- Ability to set recurring feeding schedules\n- A log of recent changes to the feeding schedule\n- Alerts for any dietary restrictions or allergies\n- A section for notes about the horse's dietary needs or restrictions\n- Quick link to update dietary information in the main horse profile\n- Option to view feeding history\n- Functionality to set up alerts for feeding times or when feed supplies are running low\n\nActions available:\n- Add new feeding time (opens a modal or leads to create page)\n- Edit feeding time (opens a modal or leads to edit page)\n- Delete feeding time (with confirmation)\n- Bulk edit feeding schedule\n\nThe page also displays a list of all scheduled feedings with details (time, feed type, quantity) and any special feeding instructions.",
  },
  {
    path: "/horses/$horseId/feeding/create",
    description:
      "This page allows users to create a new feeding time for a specific horse. The form includes:\n- Date and time picker for the feeding\n- Feed type selection (dropdown with option to add new type)\n- Quantity input\n- Option to set as recurring (daily, weekly, etc.)\n- Notes field for specific instructions\n\nUpon submission, the user is redirected back to the main feeding schedule page with the new feeding time added.\n",
  },
  {
    path: "/horses/$horseId/health",
    description:
      "This page provides a comprehensive view of a specific horse's health history and management. It includes:\n\n1. A chronological timeline or list of health events, including vaccinations, check-ups, injuries, illnesses, treatments, and vet visits.\n2. Detailed information for each health event, including date, type, description, and attending veterinarian.\n3. A summary section displaying key health information such as last check-up date, vaccination status, and ongoing treatments.\n4. Upcoming scheduled health events and reminders for future health-related tasks.\n5. Current vaccination status with upcoming due dates.\n6. A list of any ongoing health issues or special medical needs.\n7. A section for veterinarian notes.\n8. The ability to add new health records via an \"Add Health Event\" or \"Add Health Record\" button.\n9. Options to edit existing health records.\n10. Filtering capabilities to sort health events by type, date range, or other criteria.\n11. A calendar view showing past and upcoming health-related events.\n12. The ability to upload and attach relevant documents (e.g., vet reports).\n13. Quick links to update the horse's basic health information in the main profile.\n14. Option to set reminders for future health events (e.g., vaccination due dates).\n\nThis page serves as a central hub for managing and monitoring the horse's health, providing a user-friendly interface for horse owners and caretakers to track and maintain their animal's well-being.",
  },
  {
    path: "/horses/$horseId/health/create",
    description:
      'This page provides a form to add a new health record for the horse. It includes fields for:\n1. Date of the health event\n2. Type of event (dropdown: vaccination, check-up, injury, treatment, other)\n3. Description of the event\n4. Veterinarian name\n5. Any medications administered\n6. Follow-up required (yes/no, with a date field if yes)\n7. File upload for any relevant documents (e.g., vet reports)\nThe page has "Save" and "Cancel" buttons. After saving, the user is redirected back to the horse\'s health page.\n',
  },
  {
    path: "/horses/$horseId/training",
    description:
      "This page is dedicated to exercise and training logs for the specific horse. It displays a calendar view of past and upcoming training sessions. Each day can have multiple entries. Clicking on a day opens a detail view showing:\n1. Type of exercise or training\n2. Duration\n3. Intensity level\n4. Trainer's name\n5. Notes on the horse's performance or behavior\nThe page has an \"Add Training Session\" button to log a new entry. Users can also generate reports on training frequency and progress over time.\n",
  },
  {
    path: "/horses/create",
    description:
      "This page allows users to create a new horse profile. It contains a comprehensive form with fields for:\n- Basic information: name, breed, age/date of birth, gender, color, markings\n- Physical characteristics: height, weight\n- Identification: microchip number\n- Ownership and boarding details: owner name, arrival date, assigned stall\n- Special needs or requirements\n- Medical history: known conditions, allergies, medication\n- Feeding preferences\n- Exercise and training information\n- Upload area for multiple horse photos and documents (e.g., registration papers)\n\nThe form includes validation to ensure all required fields are filled. The page has a 'Save' button to create the profile and a 'Cancel' button to return to the horse list without saving. Upon successful submission, the user is redirected to the newly created horse's profile page.",
  },
  {
    path: "/horses/exercise-calendar",
    description:
      "This page presents a calendar view of all scheduled and completed exercise and training sessions for all horses. Each day on the calendar shows the number of sessions scheduled. Clicking on a day expands to show details of each session, including the horse name, exercise type, and time. Users can add new sessions directly from this calendar view. The page includes filters to show sessions for specific horses, types of exercise, or trainers. There's also a toggle to switch between a monthly view and a weekly view.\n",
  },
  {
    path: "/horses/exercise-reports",
    description:
      "This page generates reports on exercise and training progress. Users can select individual horses or groups for the report. Report options include total exercise time, types of exercises performed, progress towards specific goals, and comparisons between different time periods. The page allows customization of report parameters and date ranges. Reports can be viewed on the page, printed, or exported as PDF or CSV files. There's also an option to set up automated weekly or monthly reports to be emailed to specified users.\n",
  },
  {
    path: "/horses/list",
    description:
      "This page displays a comprehensive list of all horses in the farm. The list is presented in a table format with the following columns:\n- Horse name (clickable, leads to individual horse profile)\n- Breed\n- Age\n- Stall number\n- Owner name\n- Last feeding time\n- Next scheduled feeding\n\nThe table is sortable by each column and includes a search/filter function to easily find specific horses. Pagination is implemented for farms with many horses.\n\nActions available for each horse (via dropdown or icon buttons):\n- View profile\n- Edit profile\n- Manage feeding schedule\n- Log health update\n- Log exercise/training session\n",
  },
  {
    path: "/income",
    description:
      'This page provides a comprehensive view of all income sources. It includes:\n- A table listing all income entries, sortable by date, category, and amount\n- Filters to view income by date range, category, or source\n- A summary of total income for the selected period\n- A pie chart showing the distribution of income by category\n- A "New Income Entry" button that opens the income entry form\n- Options to edit or delete existing entries directly from the table\nThe table should support pagination and allow users to adjust the number of entries displayed per page.\n',
  },
  {
    path: "/income-categories",
    description:
      "This page allows management of income categories. It includes:\n- A list of existing income categories\n- Option to add new categories\n- Ability to edit or delete existing categories\n- For each category, display:\n  - Category name\n  - Description\n  - Number of transactions using this category\n- Confirmation dialog when attempting to delete a category\nThe page should warn users if they're trying to delete a category that's in use and offer the option to reassign those transactions to a different category.\n",
  },
  {
    path: "/income/$incomeId",
    description:
      "This page displays detailed information about a specific income entry. It shows:\n- All information entered in the income entry form\n- Option to edit the entry (opens the entry form pre-filled with current data)\n- Option to delete the entry (with confirmation dialog)\n- If it's a recurring income, show the recurrence pattern and next occurrence date\n- List of related documents or invoices with options to view or download\n- Audit trail showing when the entry was created and last modified\nThe page should have a clear layout with all information easily readable and actions (edit, delete) prominently displayed.\n",
  },
  {
    path: "/income/$incomeId/edit",
    description:
      'This page allows editing of an existing income entry. It\'s similar to the income creation form, but:\n- All fields are pre-filled with the current data\n- Includes an additional field showing when the entry was last modified\n- Has both "Save Changes" and "Cancel" buttons\n- Warns the user if they try to navigate away from the page with unsaved changes\nThe form should perform the same validations as the creation form and provide clear feedback on successful update or any errors.\n',
  },
  {
    path: "/income/create",
    description:
      "This page contains a form for adding new income entries. The form includes:\n- Date picker for the transaction date\n- Dropdown to select the income category\n- Input field for the amount\n- Dropdown to select the boarder or other income source\n- Text area for additional notes or description\n- Checkbox to mark if it's a recurring income\n- If recurring, fields to set frequency (e.g., monthly, quarterly)\n- File upload option for attaching relevant documents (e.g., invoices)\n- Submit button to save the entry\nThe form should have client-side validation to ensure all required fields are filled and the amount is a valid number.\n",
  },
  {
    path: "/inventory",
    description:
      'This page displays a comprehensive list of all inventory items, including feed, bedding, and equipment. It features:\n- A table view with columns for item name, category, current quantity, unit of measurement, reorder point, and last updated date\n- Ability to sort and filter items by different categories\n- A search function to quickly find specific items\n- A prominent "Add New Item" button at the top of the page\n- Actions column with options to view details, edit, or delete each item\n- Color-coded indicators for low stock items\n- Ability to sort the list by various columns\n\nUsers can easily manage their inventory, track stock levels, and identify items that need reordering. The page provides a user-friendly interface for efficient inventory management in a farm or agricultural setting.',
  },
  {
    path: "/inventory/$itemId",
    description:
      'This page displays detailed information about a specific inventory item. It shows all the information entered when creating the item, plus:\n- Usage history graph\n- Reorder history\n- Related maintenance requests (if applicable)\nThe page includes "Edit" and "Delete" buttons. The delete action requires confirmation.\n',
  },
  {
    path: "/inventory/$itemId/edit",
    description:
      'This page allows users to edit an existing inventory item. It\'s similar to the create page but pre-filled with the item\'s current information. Users can update any field. The page includes "Save", "Cancel", and "Delete" buttons. Additionally, it features an "Update Quantity" section for quick stock adjustments.',
  },
  {
    path: "/inventory/create",
    description:
      'This page allows users to add a new inventory item. It includes a form with fields for:\n- Item name\n- Category (dropdown: Feed, Bedding, Equipment, Other)\n- Initial quantity\n- Unit of measurement\n- Reorder point / Minimum stock level (for alerts)\n- Notes / Description\n- Supplier information\n\nThe page has "Save" and "Cancel" buttons. After saving, the user is redirected to the main inventory list page.',
  },
  {
    path: "/maintenance",
    description:
      'This is the main Maintenance Scheduling dashboard. It provides an overview of all maintenance-related tasks and schedules. The page includes:\n- A summary of upcoming maintenance tasks for the week\n- A calendar view showing scheduled maintenance tasks\n- Quick filters to view overdue tasks, today\'s tasks, or future tasks\n- A list of recently completed maintenance tasks\n- A "Create New Task" button\n- Links to view full maintenance history or generate reports\nUsers can get a comprehensive view of all maintenance activities and quickly access detailed information or schedule new tasks.\n',
  },
  {
    path: "/maintenance-requests",
    description:
      'This page displays a comprehensive list of all maintenance requests. It features a table view with columns including Request ID, Title, Requestor name, Submission date, Description, Status (New, In Progress, Completed, Cancelled), Priority, and Assigned staff. The page offers functionality to sort and filter requests by various criteria, including status and priority. A search function is available for easy navigation. Users can interact with the list by clicking on individual rows to view request details. The page includes a prominent "Submit New Request" or "Create New Request" button at the top. Each request has an action column with options to view details, edit, or delete. The layout is designed for efficient management and oversight of maintenance tasks.',
  },
  {
    path: "/maintenance-requests/$requestId",
    description:
      "This page displays the details of a specific maintenance request. It shows all the information from the submission form, plus:\n- Current status\n- Assigned staff member (if any)\n- Updates or comments\n- Completion date (if applicable)\n\nFor staff users, there are options to:\n- Update the status\n- Assign a staff member\n- Add comments or updates\n- Close the request\n- Edit the request\n- Delete the request\n\nFor boarders, there's an option to add comments or additional information. The page also shows a history of all status changes and comments, presented as a thread. This comprehensive view allows both staff and boarders to track the progress and communication related to the maintenance request.",
  },
  {
    path: "/maintenance-requests/create",
    description:
      'This page allows users to submit a new maintenance request. The form includes:\n- Request title\n- Detailed description\n- Location on the farm\n- Priority level (dropdown: Low, Medium, High, Urgent)\n- Attachments (e.g., photos)\n- Preferred completion date\n\nThe page has "Submit" and "Cancel" buttons. After submission, the user is redirected to either a confirmation page with the request details and ID or the main maintenance requests page.',
  },
  {
    path: "/maintenance/$taskId",
    description:
      "This page displays details of a specific maintenance task and allows for editing. It includes:\n- All the information entered when the task was created\n- Current status of the task (scheduled, in progress, completed, overdue)\n- Option to mark the task as complete\n- A section to add notes or update the task status\n- Edit button to modify task details\n- Option to delete the task\n- For recurring tasks, an option to view or modify future occurrences\nUsers can view all relevant information about a maintenance task, update its status, or make changes as needed.\n",
  },
  {
    path: "/maintenance/calendar",
    description:
      'This page provides a calendar view of all scheduled maintenance tasks. It includes:\n- A monthly calendar view with options to switch to weekly or daily views\n- Color-coded tasks based on priority or status\n- Ability to click on a day to see all tasks scheduled for that day\n- Option to drag and drop tasks to reschedule them\n- A sidebar with filters to show/hide different types of tasks or focus on specific stalls\n- A "Create New Task" button that opens the task creation form\nUsers can easily visualize the maintenance schedule, identify conflicts or busy periods, and make quick adjustments to the schedule as needed.\n',
  },
  {
    path: "/maintenance/create",
    description:
      'This page allows users to create a new maintenance task. It includes a form with fields for:\n- Task name/description\n- Associated stall(s) - multiple selection allowed\n- Scheduled date and time\n- Estimated duration\n- Priority level\n- Assigned staff member(s)\n- Recurrence pattern (one-time, daily, weekly, monthly)\n- Any special instructions or requirements\nThe page includes a "Save" button to create the task and a "Cancel" button to return to the maintenance dashboard without saving.\n',
  },
  {
    path: "/maintenance/reports",
    description:
      "This page allows users to generate and view reports related to maintenance activities. It includes:\n- Options to set date ranges for the report\n- Filters to focus on specific types of maintenance tasks or specific stalls\n- Ability to generate different types of reports:\n  - Maintenance history by stall\n  - Completed vs. overdue tasks\n  - Staff performance (tasks completed, average time per task)\n  - Cost analysis of maintenance activities\n- Options to export reports in various formats (PDF, CSV, etc.)\n- A preview pane to view the generated report before exporting\nUsers can analyze maintenance patterns, identify areas for improvement, and generate reports for management or record-keeping purposes.\n",
  },
  {
    path: "/pasture-rotation",
    description:
      'This page is dedicated to planning and managing pasture rotations. It features:\n- A visual representation of the farm\'s pastures\n- A calendar view showing current and planned rotations for all pastures\n- Current occupancy of each pasture\n- Last rotation date for each pasture\n- Planned next rotation date\n- Drag-and-drop interface for easy schedule adjustments\n- Color-coded pastures indicating status (in use, resting, available)\n- Option to set rotation duration for each pasture\n- Alerts for overdue rotations or pastures nearing maximum usage time\n- "Start New Rotation" and "Plan Rotation" buttons\n- Ability to assign horses or groups to pastures\n- Users can click on a pasture to view more details or update its status\n- A sidebar with pasture health tips and best practices for rotation',
  },
  {
    path: "/pasture-rotation/plan",
    description:
      'This page provides a wizard interface for planning pasture rotations. It includes:\n- A multi-step form for selecting pastures and assigning horses\n- Visual feedback on pasture usage and rest periods\n- Conflict warnings (e.g., if a pasture hasn\'t rested long enough)\n\nUsers can review the plan before finalizing. The page has "Save Plan", "Reset", and "Cancel" buttons. After saving, the user is redirected to the main pasture rotation page with an updated schedule.\n',
  },
  {
    path: "/pastures",
    description:
      'This page provides an overview of all pastures. It includes:\n- A map view of the farm with pastures clearly marked\n- List view of pastures with current status (in use, resting, available)\n- Current occupancy of each pasture (which horses or groups)\n- Days left in current rotation for occupied pastures\n- Grass condition indicators\n- "Add New Pasture" button\n- Action column with options to view details, edit, or start rotation for each pasture\n',
  },
  {
    path: "/pastures/$pastureId",
    description:
      'This page displays detailed information about a specific pasture, including:\n- All information entered during creation\n- Current status and occupancy\n- Rotation history\n- Maintenance history\n- Upcoming scheduled rotations\nIt includes "Edit", "Start Rotation", and "Delete" buttons. The delete action requires confirmation.\n',
  },
  {
    path: "/pastures/$pastureId/edit",
    description:
      "This page allows editing of pasture information. It's similar to the create page but pre-populated with the pasture's current information. It also includes a section to update the current grass condition.\n",
  },
  {
    path: "/pastures/create",
    description:
      'This page allows adding a new pasture to the system. The form includes:\n- Pasture name or number\n- Size (in acres or hectares)\n- Location description or coordinates\n- Fencing type\n- Water source\n- Shade availability\n- Maximum capacity (number of horses)\n- Notes or special features\nThe page has "Save" and "Cancel" buttons. After saving, it redirects to the main pastures page.\n',
  },
  {
    path: "/reports",
    description:
      "This page provides various reports related to event management. It includes:\n- Dropdown to select report type (e.g., facility usage, event participation, visitor frequency)\n- Date range selector\n- Filters for specific facilities, event types, or visitors\n- Option to group data (e.g., by week, month, facility type)\n- Dynamic charts and graphs based on selected report type\n- Data table with detailed information\n- Export options (CSV, PDF, Excel)\n- Save report configuration option for quick access in the future\nStaff can generate comprehensive reports to analyze farm events and make informed decisions.\n",
  },
  {
    path: "/reports/events",
    description:
      "This page generates reports on facility usage and event participation. It includes:\n- Date range selection for the report\n- Options to filter by event type, facility, or participant\n- Generated reports showing:\n  * Total number of events\n  * Most popular facilities\n  * Busiest days/times\n  * Event participation rates\n  * Revenue generated from events (if applicable)\n- Ability to export reports in various formats (PDF, CSV, etc.)\n- Option to save report configurations for future use\n- Visualizations such as graphs and charts to represent the data\n",
  },
  {
    path: "/staff-schedule",
    description:
      'This page displays the current staff schedule in a calendar view. Features include:\n- Weekly and monthly view options\n- Staff names, shift times, and assigned roles or areas\n- Color-coded shifts for different roles\n- Navigation between weeks\n- Ability to click on a day or time slot to add a new shift\n- "Add Shift" button that opens a modal for quick shift creation\n- Clickable shift blocks to view details or edit\n- Option to filter schedule by staff member or role\n- "Print Schedule" button\n- "Export to CSV" option',
  },
  {
    path: "/staff-schedule/$shiftId/edit",
    description:
      'This page allows users to edit an existing staff shift. It\'s similar to the create page but pre-filled with the shift\'s current information. Users can update any field. The page includes "Save", "Cancel", and "Delete" buttons.\n',
  },
  {
    path: "/staff-schedule/create",
    description:
      'This page allows users to create a new staff shift. It includes a form with the following fields:\n- Staff member (dropdown selection)\n- Role or area assignment (dropdown selection)\n- Date picker\n- Start time picker\n- End time picker\n- Recurring shift option with frequency settings\n- Notes field for special instructions or additional information\n\nThe page features "Save" and "Cancel" buttons. After successfully saving the new shift, the user is redirected to the main staff schedule page or view.',
  },
  {
    path: "/stalls",
    description:
      "This is the main Stall Management dashboard, providing a comprehensive overview of all stall-related information and serving as a central hub for stall management activities. The page includes:\n\n- A summary section showing total stalls, occupied stalls, available stalls, and stalls under maintenance\n- A visual representation of the barn layout, with stalls color-coded based on their status (occupied, available, under maintenance)\n- A searchable and sortable table listing all stalls with details such as stall number, current occupant (horse name), availability status, and last maintenance date\n- Quick action buttons for adding a new stall, viewing maintenance schedule, and generating occupancy reports\n- A section or tab for upcoming maintenance tasks\n- A quick-view list of recent stall activities or changes\n- Filters to sort stalls by status, horse occupant, or customization features\n- A search bar to quickly find specific stalls or horses\n\nUser interactions:\n- Clicking on a stall in the visual layout opens a popup with basic stall information and quick actions\n- Hovering over stalls shows a tooltip with the horse's name and boarder (if occupied)\n- Table rows have action buttons for view details, edit, and assign/unassign horse\n- The page auto-refreshes periodically to show real-time occupancy status\n\nUsers can navigate to other stall management features from this central hub, including links to create a new stall, view all stalls, and access the maintenance schedule.",
  },
  {
    path: "/stalls/$stallId",
    description:
      "This page displays detailed information about a specific stall. It includes:\n- Stall number and current status (occupied/available)\n- Details of the current occupant (horse), if any, with a link to the horse's profile\n- Stall specifications, including size, features, customizations, and special requirements\n- Maintenance history and upcoming scheduled maintenance tasks\n- A section for notes or special instructions related to the stall\n- Action buttons for editing stall info, assigning/unassigning a horse, scheduling maintenance, and deleting the stall (with appropriate warnings)\n- A section showing the stall's location on a barn map\n- Options to mark the stall as available or occupied\n\nUsers can view all relevant information about a stall and manage its details from this page, including adding notes, modifying occupancy, and scheduling maintenance tasks.",
  },
  {
    path: "/stalls/$stallId/assign",
    description:
      'This page facilitates the assignment of a horse to a stall. It includes:\n- Stall information summary\n- A searchable dropdown to select a horse\n- Fields to specify assignment details (e.g., start date, expected duration)\n- Option to add notes about the assignment\n- "Assign" and "Cancel" buttons\n- If the stall is currently occupied, it shows a warning and requires confirmation before reassignment\n',
  },
  {
    path: "/stalls/$stallId/customize",
    description:
      "This page focuses specifically on managing the customizations for a stall. It includes:\n- Current list of customizations with options to edit or remove each\n- Form to add new customizations, including:\n  - Dropdown for common customization types (e.g., rubber mats, automatic waterers)\n  - Free-text field for custom features\n  - Description field for each customization\n- Option to set customizations as permanent or temporary\n- Save and Cancel buttons\n",
  },
  {
    path: "/stalls/$stallId/edit",
    description:
      "This page allows editing of an existing stall's information. It features a pre-filled form similar to the create page, including:\n- Stall number (may be non-editable)\n- Size dimensions\n- Location in the barn\n- Available features (checkboxes)\n- Current availability status\n- Custom notes or requirements\n- Option to update or add customizations\n- Option to change the assigned horse (if applicable)\n\nUser interactions:\n- Form validation to ensure required fields are filled and data is in the correct format\n- 'Save Changes' button to update the stall information\n- 'Cancel' button to return to the Stall Details page without saving changes\n- Option to delete the stall\n- A warning if changes will affect the current occupant (if the stall is occupied)\n\nThe page aims to provide a comprehensive interface for modifying all aspects of a stall's details while ensuring data integrity and user awareness of potential impacts.",
  },
  {
    path: "/stalls/create",
    description:
      "This page allows users to create a new stall record in the system. It includes a form with the following fields:\n\n- Stall number (required)\n- Stall size/dimensions\n- Location within the barn/block\n- Customizations or features (e.g., rubber mats, automatic waterers, fans)\n- Initial availability status\n- Notes or special instructions\n\nThe page layout includes:\n- Form validation to ensure required fields are filled and data is in the correct format\n- A 'Save' button to create the new stall\n- A 'Cancel' button to return to the stall list or dashboard without saving\n- Option to 'Save and Add Another' for quickly adding multiple stalls\n- Ability to add multiple customizations with descriptions\n- Option to assign a horse to the stall upon creation\n\nUser interactions include filling out the form, selecting features via checkboxes, and saving or canceling the stall creation process.",
  },
  {
    path: "/stalls/list",
    description:
      "This page displays a comprehensive list of all stalls in the facility. The main features include:\n\n1. Table View:\n   - Columns: Stall Number, Status (Occupied/Available), Current Occupant (Horse Name), Boarder, Last Cleaned, Next Scheduled Maintenance, and Customizations\n   - Sortable columns\n   - Action buttons for each stall: View Details, Edit, and Schedule Maintenance\n\n2. Filtering and Sorting:\n   - Advanced filtering options for Status, Occupancy, and Maintenance Due\n   - Search function to find specific stalls, horses, or boarders\n   - Sorting functionality for each column\n\n3. User Interactions:\n   - 'Add New Stall' or 'Create New Stall' button at the top of the page\n   - Clicking on a stall number navigates to the Stall Details page\n   - Options to export the list as CSV or PDF\n\n4. Additional Features:\n   - Pagination controls for navigating through large numbers of stalls\n   - Quick assessment of all stalls' status\n   - Ability to take necessary actions directly from this view\n\nThis page serves as a central hub for stall management, allowing users to efficiently monitor and manage all stalls in the facility.",
  },
  {
    path: "/stalls/maintenance",
    description:
      "This page manages maintenance scheduling for all stalls. It features:\n\n1. Calendar Views:\n   - Monthly, weekly, and daily views\n   - Color-coded tasks by maintenance type (cleaning, repairs, inspections)\n   - Drag-and-drop functionality for rescheduling\n\n2. Task Management:\n   - Add new maintenance tasks\n   - Mark tasks as completed\n   - Edit or cancel existing tasks\n   - Quick action buttons to reschedule or assign tasks to staff\n\n3. Filtering and Display Options:\n   - Filter tasks by stall, maintenance type, date range, or assigned staff\n   - Switch between calendar and list views\n\n4. Sidebar Features:\n   - List of upcoming tasks for the next 7 days\n   - Overview of upcoming and overdue tasks\n\n5. Detailed Information:\n   - Click on a day for detailed task view\n   - Form for creating/editing tasks includes stall selection, task type, date/time, and staff assignment\n\n6. User Interactions:\n   - Click on day/stall to schedule new maintenance\n   - Mark tasks as completed directly from calendar view\n\nThis comprehensive page provides a user-friendly interface for efficient stall maintenance scheduling and management.",
  },
  {
    path: "/stalls/map",
    description:
      "This page provides a visual representation of the barn layout showing stall occupancy.\n\nThe page layout includes:\n1. A large, interactive map of the barn layout with each stall represented.\n2. Color-coding for stalls based on their status (occupied, available, under maintenance).\n3. A legend explaining the color-coding and any icons used.\n4. A sidebar with summary statistics of stall occupancy and availability.\n\nUser interactions:\n- Zooming and panning controls for the map.\n- Clicking on a stall in the map opens a popup with basic information and quick actions.\n- A search function to highlight specific stalls, horses, or boarders on the map.\n- Filters to show only occupied, available, or maintenance stalls.\n- An option to switch between different barn levels or areas if applicable.\n- A 'Print Map' button to generate a printable version of the current map view.\n",
  },
  {
    path: "/stalls/occupancy",
    description:
      "This page provides a visual representation of stall occupancy and availability. It includes:\n- An interactive barn layout map or grid showing all stalls\n- Color-coded stalls indicating occupancy status (e.g., green for available, red for occupied, yellow for maintenance)\n- Ability to click on or hover over a stall to view quick details or navigate to the stall's detail page\n- Filters to view occupancy by different criteria (e.g., by barn section, by horse type, by date range)\n- A legend explaining the color codes and symbols used\n- Summary statistics of current occupancy rates\n- Option to print the occupancy chart\n- Quick-action buttons to update stall status\n",
  },
  {
    path: "/transactions",
    description:
      "This page provides a unified view of all financial transactions, including both income and expenses. Features include:\n- A filterable and sortable table showing date, type (income/expense), category, amount, and description\n- Total income, total expenses, and net amount for the selected period\n- Filters for date range, transaction type, category, and amount\n- Options to add new transactions, export data, and generate reports\n- Ability to batch edit or delete transactions\nThe page should use color coding to differentiate between income and expenses, and provide quick links to view details of each transaction.\n",
  },
  {
    path: "/visitors",
    description:
      'This page is the Visitor Management dashboard, providing comprehensive tools for tracking and managing farm visitors. Features include:\n- A table view listing all visitors with columns for name, type (e.g., trainer, vet, farrier), last visit date, and status\n- Search functionality and filters to sort, search, and categorize visitors\n- "Add New Visitor" button with a form to register new visitors\n- Calendar view showing scheduled and upcoming visitor appointments\n- Check-in/check-out system for tracking current visitors on the property\n- Option to view detailed visitor information and history\n- Ability to associate visitors with specific horses or boarders\n- Quick access to recent visitor activity and upcoming scheduled visits\n- Reporting tools to analyze visitor frequency and patterns\n- For staff: ability to manage visitor access and maintain a log of farm visitors\n\nThe page has a clean, tabular layout for the visitor list with easy-to-use forms and navigation options. Users can access more detailed views from this central dashboard, allowing efficient management of all visitor-related activities.',
  },
  {
    path: "/visitors/$visitorId",
    description:
      "This page displays detailed information about a specific visitor. It includes:\n- Visitor name and contact information\n- Visitor type\n- All visitor details\n- Log of past visits and history\n- Upcoming scheduled visits\n- Associated boarders or horses\n- Option to edit visitor information\n- For staff: buttons to check-in or check-out the visitor\n- Notes section for staff to add comments about the visitor\n- Special instructions\n- Options to schedule a new visit or remove visitor access\n\nStaff can quickly access all necessary information about a visitor and manage their access, including editing details, scheduling visits, and controlling access permissions.",
  },
  {
    path: "/visitors/create",
    description:
      "This page allows adding a new visitor to the system. It includes a form with fields for:\n- Visitor name\n- Type of visitor (dropdown: trainer, vet, farrier, etc.)\n- Contact information\n- Associated boarder(s) if applicable\n- Anticipated frequency of visits\n- Special instructions or notes\n- Upload area for any required documentation\nStaff can create comprehensive visitor profiles for easy management and tracking.\n",
  },
  {
    path: "/visitors/register",
    description:
      "This page allows farm staff to register new visitors. It includes:\n- Visitor name and contact information fields\n- Visitor type selection (trainer, veterinarian, farrier, etc.)\n- Purpose of visit\n- Date and time of visit\n- Duration of stay\n- Associated boarder or horse (if applicable)\n- Any special requirements or notes\n- Submit button to register the visitor\n",
  },
] as const;
