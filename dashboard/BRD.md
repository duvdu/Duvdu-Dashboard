i# 1. Feature: User KPIs Dashboard

**Purpose:** Display high-level metrics and real-time statistics related to platform usage, project
activity, and support operations.

## Key Components

```
KPI Description Notes
Projects Uploaded Number of projects submitted by users
Includes duration
filter
Top Users
Ranked list of top Clients or Service
Providers (toggle)
Toggle switch:
Clients / SPs
Active Users Split Count of active users segmented by role
Clients vs Service
Providers
Live Users Online
Now
Real-time count of currently online users
Split: Clients vs
SPs
New Users
Number of new users registered in the
selected period
Includes duration
filter
Open Disputes &
Complaints
Real-time tally of unresolved DCR cases
Based on type of
D / C / R
Contracts Count
Breakdown of contracts by status:
Closed, Pending, Cancelled
Includes duration
filter
```

## User Flow

1. Admin opens the dashboard and sets the desired time range.
2. All metrics refresh automatically or on demand.
3. Toggle between Clients/SPs where applicable.

# 2. Feature: User Management

**Objective:**
Provide admins with a centralized interface to search, view, and manage user accounts,
including verification, communication, and status actions.

## Key Components

```
Component Purpose
Search Bar Quick lookup by Name, Phone, Email, or @Username.
Filter Panel
Filter users by:
```

- **User Type** (Customer, Provider, Admin)
- **Status** (Active, Pending, Suspended)
  **User Table**
  Displays user list with: Name, Email, Type, Status, and quick
  actions.
  **Row Actions** View Profile & Send Notification & Message User
  **Bulk or individual
  Actions Toolbar**
  Enables multi-select actions: Suspend & Resume & Hide & Block &
  Export CSV

## Full Account Actions

```
Action Description
Suspend Temporarily disables the account (with optional reason & expiry).
Resume Reactivates a suspended account.
Hide Soft-deletes the user from listings.
Block Permanently blocks the user from the platform.
Action Log Shows all admin actions on this user with timestamps.
```

## Sub-Feature A: Identity Verification

**Purpose**
Allow admins to individually manage and control each part of user identity verification. Instead of
approving the full profile, admins can approve or disapprove specific items like face photo,
name, email, phone number, or bank account.
● Identity verification is **not a one-time process**. This feature works as an ongoing
**review system**.
● Admins can revisit a user profile at any time and re-evaluate any field.
● For example, while reviewing users, if the admin finds a mismatch (e.g., fake
photo, suspicious bank account), they can disapprove the specific item
immediately.
● The system will then block the related features and notify the user to update that
item.

## Verification Items & Controls

```
Item Admin Control
```

Face Photo Approve / Disapprove selfie or ID image
Full Name Approve / Disapprove (based on consistency)
Email Address Approve / Disapprove
Phone Number Approve / Disapprove
Bank Account Approve / Disapprove (e.g., IBAN review)
Each item has its own status: **Approved / Disapproved / Pending**

## System Behavior on Disapproval

When any required item is disapproved:
● The user is blocked from related features (e.g., booking, payout, account access).
● The user receives an auto-notification: “Your [item] was rejected. Please update it to
continue using the platform.”

## User Flow

```
● User uploads verification data: face image, name, email, phone, bank.
● Admin opens the Identity Verification tab in the user’s profile.
● Admin reviews and approves/disapproves each item separately.
● If any item is disapproved:
○ Admin optionally adds a reason.
○ The system sends a notification.
○ Access is restricted.
```

## Sub-Feature B: Payout Method Management

**Purpose:**
Allow the admin to **validate, disable, or leave** payout methods (Bank/Wallet) as-is.
**Admin approval is optional** — users can withdraw unless the method is disabled.

```
Component Purpose
Payout Methods Users can add a Bank Account or Mobile Wallet to receive withdrawals.
Validate Admin can mark the method as reviewed (optional).
Disable Admin can block the method. The user won’t be able to withdraw with it.
```

## User Flow:

1. User adds a payout method → status = **Active**.
2. Admin reviews the details (e.g. IBAN or wallet info).
3. Admin can:
   ○ **Validate** → Mark the method as trusted.
   ○ **Disable** → Prevent the user from withdrawing with it.
4. If **Disabled** , the user must update or resubmit to use withdrawals.

# Sub-Feature D: Complaints / Disputes / Requests (DCR)

# Viewer

**Purpose**
Give admins one-click access to all DCR cases filed _by this specific user_ , bridging User
Management with the full DCR module.

**Components**
Component Purpose
**DCR Badge**
Shows count of open cases per user (e.g., “3 Cases”). Colored by
urgency.
**View DCR Button**
Opens a filtered list (or modal) of that user’s
complaints/disputes/requests.
**Inline Case Status** Tooltip or mini-list showing latest case status without leaving the page.
**Interaction Flow**

**1. List View**
The User Table displays a DCR Badge next to each user showing the number of active
cases.
**2. Open Cases**
Admin clicks View DCR on a row or in the user’s profile.
**3. Filtered DCR Panel**
System opens the DCR module pre-filtered to:
○ User ID = current user
**○** All types (C/D/R)
**4. Case Management**
From this filtered view, admin can:
○ Read or update the case log
○ Change status, priority, urgency
**○** Escalate, assign/reassign agent, or archive (per Feature 4 capabilities)
**5. Return**
Closing the DCR view brings admin back to the original User Management context.

# Sub-Feature E: User Subscription Insight

## Purpose

Allow admins to see a user’s **subscription performance** in detail — including how many
contracts (subscriptions) are **paid** , how many are still **unpaid/pending** , and give the admin the
ability to **control how many total referral-based contracts the user is allowed to have**.

## Components

```
Component Description
Paid Contracts
Number of users who have successfully paid to subscribe to this
user.
Pending Contracts Number of active subscribers who haven’t completed payment yet.
Referral Quota Total number of referral-based contracts allowed for this user.
Quota Controls Admin can add/remove referral quota per user.
Date Filter Filter all metrics by date (Today, This Week, This Month, Custom).
```

## User Flow (Per User)

1. Admin opens a user’s profile from the User Management section.
2. Clicks the **"Subscriptions"** tab or 📈 icon.
3. A detailed panel opens, displaying:
   ○ **Paid Contracts Count**
   ○ **Pending Contracts Count**
   ○ **Referrals Left / Allowed Quota**
   ○ **Date Filter** to view historical subscription data
4. Admin can:
   ○ Adjust the **referral/contract quota** per user (Add, Remove, or Set value).
   ○ View all changes in the **Action Log** , including timestamp and admin identity.

# Sub-Feature F: User Financial Log

## Purpose

Give admins a complete, date-filterable ledger of every money event tied to the user (escrow,
payouts, refunds, subscription shares, fees).
**Component Purpose
Filter Bar**
Filter by Date Range, Transaction Type (Escrow Deposit, Payout,
Refund, Commission, etc.).
**Financial Log
Table**
Columns: Date/Time, Type, Amount (+/–), Currency, Related
Project/Contract ID, Status, Notes.
**Export CSV** One-click export of the filtered ledger for offline review.
**Open Transaction**
Row action → jump to Escrow / Payout detail view in Financial or
Escrow modules.
**User Flow**

1. Admin opens a user’s profile ► selects the **“Financial Log”** tab.
2. Sets filters (e.g., Last 30 days ＋ Type = Payout).
3. Reviews table or exports CSV.
4. Clicks a row to open the original transaction record.

# Sub-Feature G: Content / Project Log

**Purpose**
Track every action the user performs on projects (upload, edit, status change) for fast auditing.
**Component Purpose
Search & Filter** Search by Project ID / Title, filter by Action Type, Status, Date Range.
**Project Log
Table**
Columns: Date/Time, Project ID & Title, Action (Upload / Edit / Approve /
Reject / Pause / Delete), Status, Views, Bookings.
**View Project** Row action → open project in **Projects Content Management** module.
**User Flow**

1. Admin opens user profile ► **“Project Log”** tab.
2. Uses search or filters to locate specific actions.
3. Clicks **View Project** to inspect the live/public version.

## Sub-Feature H: Contract Log

**Purpose**
Allow admins to view and manage all contract-related activities associated with a specific user.
This includes reviewing each contract’s lifecycle — such as creation, updates, cancellation, and
deletion — and performing direct actions (edit, delete, cancel) from a centralized interface.

## Components

```
Component Purpose
Contract Activity Log
Table
Shows all contracts related to the user along with their current
status and history of actions.
Contract Controls Admin can Edit, Delete, or Cancel each contract from the table.
Contract Filter Panel
Filter by status (Active, Inactive, Canceled), contract type,
SP/Client, or date range.
Search Bar Quickly find contracts by Contract ID or SP/Client name.
Linked Contract
Viewer
Allows admin to jump into the full contract detail view for inspection
or editing.
```

## Log Table Columns

```
Column Description
Date/Time Timestamp of the logged activity
Contract ID Unique identifier for the contract
SP / Client The other party involved in the contract (Service Provider or Client)
Status
Current status of the contract: Created / Updated / Canceled /
Deleted
Controls Buttons for Edit / Delete / Cancel
```

## Contract Actions

```
Action Description
Edit Open the contract in edit mode to update terms or details.
Delete Permanently remove the contract from the system (with confirmation).
Cancel Mark contract as canceled; stops further processing or obligations tied to it.
```

## User Flow

1. Admin navigates to the User Management panel.
2. Selects a user and opens the **"Contracts" tab** or 📝 icon.
3. The system displays the **Contract Log Table** , showing all contracts tied to the user.
4. Admin may:
   ○ Filter or search contracts.
   ○ View the current status (e.g., Created, Updated, Canceled, Deleted).
   ○ View the SP or Client name.
   ○ Perform actions: Edit / Delete / Cancel.
5. Clicking any contract row opens the full contract in the main Contract Management
   module.

# 3. Feature: Projects Content Management

**Purpose:** Help admins handle submitted projects quickly using search, filters, and row actions.

## Key Components

```
Component Purpose
Search Bar Search projects by: Title, ID, Keyword
Filter Panel Filter by: Status, Category, Date Range, Sort Order.
Projects Table Columns: Title, Status, Views, Bookings, Actions.
Row Actions Approve, Reject, Edit, Pause, Delete, View Public Version.
History Log Track edits and status changes for each project.
```

## User Flow

1. Admin searches or applies filters to locate projects.
2. Clicks an action icon per row (e.g., Approve, Edit) to update project state.
3. Optionally opens the public view to verify changes.

# 4. Feature: DCR (Complaint / Dispute / Request)

# Management

## Purpose

Provide admins with a centralized system to manage user-submitted **Complaints, Disputes,
and Requests (D/C/R)** — including case creation, filtering, escalation, threaded updates, and
smart reply templates.

## Settings Management

Admins can configure the following settings from the DCR Settings Panel:
**Setting Description
Type** Complaint, Dispute, Request (case category).
**Priority** Case severity: Normal, Angry Customer, Escalated.
**Status** Case lifecycle: Open → In Progress → Resolved.
**Source** Case origin: Contact Form, Agent Input, Email, etc.
**Action Keywords**
Keywords used to detect case type and match to reply
templates.
**Suggested
Message**
Predefined replies linked to action keywords.
All settings are dynamic and impact how cases behave when created, updated, or replied
to.

## Key Components

```
Component Description
Add New Case
Create a case with subject, type, priority, and notes. Logs
agent name + date.
Search Bar
Search by Case Number, User Name, Phone, Email, or
Keywords.
Filter Panel
Filter by Type (C/D/R), Status, Priority, Days Open, Source,
Agent, Subject.
DCR Table
Display case summary: Case #, User Info, Contact, Type,
Priority, Status, Assigned Agent.
Row Actions
Update case: Status, Priority, Urgency, Type, Assign Agent,
Escalate, Archive.
Case Log Panel
● View all updates in a threaded log.
● Add new updates using a text editor.
● Choose visibility :
○ Internal (only admins)
○ Send to User (user will receive notification)
● System auto-includes:
Timestamp & Agent Name & Visibility Status & Update
Note
Suggested Message
Auto-suggested replies based on case keywords or update
history.
```

## User Flow

1. Admin opens or creates a case.
2. Admin views or writes updates via the **Case Log Panel**.
3. When writing an update, admin chooses:
   ○ Internal only (not shown to user)
   ○ Send to User (user receives the notification)
4. The system logs each update with agent name, timestamp, note, and visibility status.
5. Smart suggestions appear automatically when keywords are detected.
6. Admin may escalate, assign, or archive the case.

## Legend

```
● C = Complaint
● D = Dispute
● R = Request
● Urgency Colors :
○ 1 day
○ 2 days
○ 3+ days
● Priority Levels :
○ Normal
○ Angry Customer
○ Escalated
```

# 5. Feature: Messaging & Notifications

**Purpose:** Provide tools for admins to manage internal messages and send notifications to
individual users or groups.

## Key Sections

**Messaging**
Component Purpose
**Search bar** Quick lookup by Name, Phone, Email, or @Username.
**Message Log** View conversation history between system and users.
**Send
Message**
Start a conversation with any user using simple text input.
**1-on-
Threads**
Select user (e.g., Ahmed) → show list of all conversations with
others.
**Open
Conversation**
Click on any thread to view the full message history and
continue chatting.
**Notifications**
Component Purpose
**Search bar** Quick lookup by Name, Phone, Email, or @Username.

```
Push
Notification
Admin selects message type + recipients (single or group) →
sends instantly.
Notification
History
Log of all previously sent notifications (title, body, timestamp).
```

## User Flow

1. Admin selects messaging or notification tab.
2. For messaging:
   ○ Search and select user → view or initiate conversation.
   ○ Messages stored in a log and updated in real time.
3. For notifications:
   ○ Select type, target (user or group), and write a message.
   ○ Submit → notification is sent and logged.

# 6. Feature: Financial Performance Dashboard

**Purpose:** Provide real-time visibility into the platform’s financial health through KPIs like
revenue, payouts, and refunds.

## Key Components

```
KPI Description Time Interval
Support
Total Revenue
& Net Revenue
```

- Card: Gross Revenue- Card: Net
  Revenue (after platform commission)-
  Optional: trend or % change
  Today, This
  Week, This
  Month, Custom
  Escrow
  Balance &
  Payouts
- Live Escrow Balance (real-time)-
  Card: Total Payouts Processed-
  Optional: payout trend line
  Date range filter
  for payouts

```
Refunds
Issued
```

- Card: Total amount refunded-
  Optional: list or bar chart by
  category/reason
  Today, This
  Week, This
  Month, Custom

## User Flow

1. Admin selects time range from dashboard filter (e.g., This Week).
2. Dashboard KPIs and charts update accordingly.
3. Admin can hover or click on cards/charts for more detail.

# 7. Feature: Escrow Management

**Purpose:** Enable admins to oversee, release, and audit platform escrow transactions through a
structured interface.

## Key Sections

```
Section Description Actions Available
Escrow Balance
Overview
Live display of current escrow
balance.
View only
Escrow Ledger
Table
Detailed table with Contract ID,
Client, Service Provider (SP),
Milestone, Amount, Status.
Release Funds & Hold Payment &
Refund Client & View Details & Instant
Payout
Escrow Filter &
Search
Filters to search by Project, Client,
SP, Date, and Payment Status.
Input only
Escrow Action Log
Tracks who released/held/refunded
funds, when it occurred, and why.
View only
```

## Notes

1. When a user pays for a contract, the full amount is securely held in the platform’s escrow
   balance.
2. After the contract is completed and the service provider delivers the agreed-upon work,
   the admin manually releases the funds from escrow.

3. Note: This process is currently manual, but it will be automated once Paymob Payout
   integration is activated.
4. Upon releasing the payment, the contract’s payout status is updated from “Waiting
   Payout” to “Completed” in the system.

## User Flow

1. **View escrow balance**
   Admin sees live total escrow balance.
2. **Filter projects**
   Filters by Contract ID, Client, Service Provider, Date, or Payment Status.
3. **Take financial action**
   ○ **Release:** Send funds to service provider (status → Completed)
   ○ **Refund:** Return funds to client
   ○ **Hold:** Pause payout (status → Waiting for Review)
4. **View action history**
   Log shows who did what and when for full traceability.

## 8. Feature: Subscription Management

**Purpose:**
Provide visibility into user subscription activity (paid & unpaid) and allow admins to control
subscription commission percentage.
**Component Description
Subscriber Count** Total number of active subscribers ( **paid & unpaid** ).
**Subscriber Revenue** Total amount generated from **paid** subscriptions.
**Duration Filter**
Filter subscriber metrics by date range: Today, This Week, This
Month, etc.
**Pricing Control** Admin can set or update the platform commission percentage.

## User Flow

1. Admin opens the subscription dashboard.
2. Selects a date range to view:
   ○ Active subscriber count (paid & unpaid)
   ○ Total revenue from **paid** subscriptions
3. Admin updates commission percentage if needed.

## 9 Feature: Legal Pages Management

**Purpose:**
Provide a flexible system for managing all legal and informational content as individual pages.
Each page includes a title and content in **Arabic and English** , and can be added or updated at
any time from the admin panel.

## Key Features

```
Feature Description
Add Page
Admin can create a new legal/informational page with multilingual
support.
Edit Page Modify the title or content in Arabic and English.
Delete Page Remove outdated or irrelevant pages from the system.
Visibility Control Set page as public/hidden.
```

## Page Fields

```
Field Description
Title (EN) Page title in English
```

```
Title (AR) Page title in Arabic
Content (EN) Full content in English (HTML/Text)
Content (AR) Full content in Arabic (HTML/Text)
```

## Examples of Pages

```
● About Us
● FAQ
● Terms & Conditions
● Privacy Policy
● Refund Policy
● Blog Post
```

## User Flow

1. Admin accesses the **Legal Pages** management panel.
2. Click **"Add Page"** to create a new document.
3. Fills in the title and content in both **Arabic and English**.
4. Save the page. It becomes live instantly or after optional approval.
5. Admin can later **edit, hide, or delete** pages as needed.
