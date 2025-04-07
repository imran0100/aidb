
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { z } from 'zod';
import mysql from 'mysql2/promise'; // Import mysql2/promise for MySQL

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// Database connection configuration (move to environment variables for production!)
const dbConfig = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER ,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
};

async function runGenerateSQLQuery(query: string) {
  "use server";
  // Check if the query is a SELECT statement (and prevent harmful queries)
  if (
    !query.trim().toLowerCase().startsWith("select") ||

    query.trim().toLowerCase().includes("drop") ||
    query.trim().toLowerCase().includes("delete") ||
    query.trim().toLowerCase().includes("insert") ||
    query.trim().toLowerCase().includes("update") ||
    query.trim().toLowerCase().includes("alter") ||
    query.trim().toLowerCase().includes("truncate") ||
    query.trim().toLowerCase().includes("create") ||
    query.trim().toLowerCase().includes("grant") ||
    query.trim().toLowerCase().includes("revoke")
  ) {
    console.warn("Potentially harmful query blocked:", query); // Log blocked queries for security monitoring
    return { error: "Only SELECT queries are allowed for safety reasons." }; // Return an error object
  }

  let data: any;
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(query); // Destructure to get only rows array
    console.log("SQL Query Rows:", rows);
    data = rows;
    await connection.end();
  } catch (e: any) {
    console.error("Error executing SQL query:", e);
    if (e.message.includes('Unknown table') || e.message.includes("Table '.*' doesn't exist")) {
      return { error: "Table does not exist in the database." };
    } else {
      return { error: `Database error: ${e.message}` };
    }
  }

  return data;
}

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai('gpt-4o'),
    messages,
    maxSteps:2,
    

    system: `You are a SQL (mysql) expert. Your job is to help the user write a SQL query to retrieve the data they need.**It's important to be flexible with table names. Users might use slightly different names than the exact schema.  If the user refers to a table name that is not an exact match but is semantically similar to a table in the schema, you should intelligently map it to the correct table. For example, if the user says "country", and the schema has a table named "countries", you should understand that "country" refers to the "countries" table.**  Focus on understanding the user's intent and choose the most appropriate table from the schema based on the context. The database schema is as follows :
       approval_message (
    id int(11),
    message longtext,
    associate_with varchar(100),
    add_date_time timestamp,
    update_date_time timestamp
);

backup_software (
    id int(11),
    country_id int(11),
    country varchar(50),
    back_up_software_price double,
    back_up_software_cost double,
    backup_target_storage_type varchar(250),
    backup_target_storage_price double,
    backup_target_storage_cost double,
    add_date_time timestamp,
    update_date_time timestamp
);

cant_find_my_user (
    id varchar(50),
    request_by varchar(100),
    request_type varchar(100),
    user_name varchar(100),
    status smallint(6),
    add_date_time timestamp,
    update_date_time timestamp
);

contract_term (
    id int(11),
    name varchar(100),
    parent int(11),
    contract_period int(11),
    add_date_time timestamp,
    update_date_time timestamp
);

countries (
    id int(10) unsigned,
    name varchar(191),
    currency varchar(100),
    code varchar(100),
    symbol varchar(100),
    phonecode varchar(100),
    add_date_time timestamp,
    update_date_time timestamp
);

database_list (
    id int(11),
    database_type varchar(50),
    country_id int(11),
    price_per_license double,
    price_per_virtual_machine double,
    cost_per_license double,
    cost_per_virtual_machine double,
    vcore int(11),
    add_date_time timestamp,
    update_date_time timestamp
);

dr_license (
    id int(11),
    license varchar(100),
    country_id int(11),
    price double,
    cost double,
    add_date_time timestamp,
    update_date_time timestamp
);

email_templates (
    email_template_id varchar(50),
    template_name varchar(100),
    content longtext,
    associate_with varchar(100),
    add_date_time timestamp,
    update_date_time timestamp
);

exchange_rate (
    id int(10) unsigned,
    rate_less_than_1_year double,
    rate_equal_to_1_year double,
    rate_greater_than_1_year double,
    to_country_name varchar(100),
    to_country_currency varchar(100),
    to_country_code varchar(100),
    to_country_symbol varchar(100),
    to_country_phonecode varchar(100),
    add_date_time timestamp,
    update_date_time timestamp
);

firewall (
    id int(10) unsigned,
    bandwidth varchar(50),
    country_id int(11),
    price double,
    cost double,
    add_date_time timestamp,
    update_date_time timestamp
);

hybrid_connectivity (
    id int(11),
    type varchar(100),
    country_id int(11),
    price double,
    cost double,
    add_date_time timestamp,
    update_date_time timestamp
);

infrastructure (
    id int(11),
    type varchar(100),
    add_date_time timestamp,
    update_date_time timestamp
);

load_balancer (
    id int(10) unsigned,
    bandwidth varchar(50),
    country_id int(11),
    price double,
    cost double,
    add_date_time timestamp,
    update_date_time timestamp
);

mail_log (
    mail_log_id int(11),
    quote_id varchar(255),
    user_id varchar(255),
    customer_name varchar(100),
    sfdc_id varchar(50),
    sender_name varchar(100),
    sender_email varchar(100),
    sender_position varchar(100),
    receiver_name varchar(100),
    receiver_email varchar(100),
    subject varchar(100),
    content longtext,
    cantMyUser_name varchar(100),
    cantMyUser_email varchar(100),
    password varchar(250),
    status smallint(6),
    add_date_time timestamp,
    update_date_time timestamp
);

margin (
    id int(11),
    margin int(11),
    component varchar(100),
    add_date_time timestamp,
    update_date_time timestamp
);

module_permission (
    module_permission_id varchar(50),
    user_role_id varchar(50),
    module_name varchar(50),
    view tinyint(4),
    add tinyint(4),
    edit tinyint(4),
    delete tinyint(4),
    add_date_time timestamp,
    update_date_time timestamp
);

network_bandwidth (
    id int(10) unsigned,
    bandwidth varchar(50),
    country_id int(11),
    price double,
    cost double,
    add_date_time timestamp,
    update_date_time timestamp
);

notification (
    id int(11),
    sent_to varchar(100),
    sent_by varchar(100),
    notification_for tinyint(4),
    message text,
    quote_id varchar(255),
    active smallint(6),
    add_date_time timestamp,
    update_date_time timestamp
);

operating_systems (
    id bigint(20) unsigned,
    os_name varchar(255),
    os_type varchar(50),
    infrastructure_id int(11),
    add_date_time timestamp,
    update_date_time timestamp
);

other_settings (
    id int(11),
    user_id varchar(50),
    new_quote_prefix varchar(50),
    draft_quote_prefix varchar(50),
    archived_quote_prefix varchar(50),
    approved_quote_prefix varchar(50),
    reject_quote_prefix varchar(50),
    add_date_time timestamp,
    update_date_time timestamp
);

password_resets (
    password_reset_id varchar(50),
    email varchar(100),
    token varchar(250),
    expiry varchar(50),
    add_date_time timestamp,
    update_date_time timestamp
);

public_ip (
    id int(11),
    country_id int(11),
    country varchar(50),
    price_per_ip double,
    cost_per_ip double,
    add_date_time timestamp,
    update_date_time timestamp
);

quote (
    quote_id varchar(255),
    previous_quote_id varchar(100),
    prefix varchar(100),
    customer_name varchar(100),
    sfdc_id varchar(100),
    report_data longtext,
    version int(11),
    version_status tinyint(4),
    am_id varchar(50),
    am_name varchar(50),
    sa_id varchar(50),
    sa_name varchar(50),
    cda_id varchar(50),
    cda_name varchar(50),
    pt_id varchar(50),
    pt_name varchar(50),
    price_margin double,
    status tinyint(4),
    progress tinyint(4),
    is_rejected tinyint(4),
    isCancelled tinyint(4),
    isUpdated tinyint(4),
    quotation_status_summary longtext,
    country varchar(100),
    currency varchar(10),
    region text,
    rate_type varchar(50),
    exchange_rate double,
    add_date_time timestamp,
    update_date_time timestamp,
    quotation_unique_id varchar(250),
    revenue double,
    cogs double,
    gross_margin double,
    gsmc double,
    overhead double,
    net_margin double,
    net_margin_percentage varchar(100),
    contract_term varchar(20),
    contract_term_month varchar(20),
    contract_period int(11),
    margin_analysis longtext
);

quote_attachments (
    quote_attachments_id varchar(100),
    quote_id varchar(100),
    filename varchar(100),
    add_date_time timestamp,
    update_date_time timestamp
);

quote_status (
    quote_status_id varchar(50),
    quote_id varchar(50),
    sent_to varchar(50),
    sent_to_name varchar(50),
    message longtext,
    progress smallint(6),
    add_date_time timestamp,
    update_date_time timestamp
);

rate_limits (
    id int(10) unsigned,
    url varchar(1000),
    token varchar(1000),
    user_id varchar(40),
    request_count int(11),
    last_request_time timestamp(3)
);

regions (
    id int(11),
    country_id int(11),
    country varchar(50),
    name varchar(50),
    add_date_time timestamp,
    update_date_time timestamp
);

rejection (
    rejection_id varchar(50),
    quote_id varchar(50),
    quote_status_id varchar(50),
    reason_for_rejection varchar(255),
    message longtext,
    add_date_time timestamp,
    update_date_time timestamp
);

rejection_message (
    id int(11),
    message longtext,
    associate_with varchar(100),
    add_date_time timestamp,
    update_date_time timestamp
);

series (
    id bigint(20) unsigned,
    series_name varchar(255),
    country_id int(11),
    location varchar(255),
    add_date_time timestamp,
    update_date_time timestamp
);

storage (
    id int(11),
    country_id int(11),
    storage_type varchar(100),
    storage_sub_type varchar(100),
    storage_price double,
    storage_cost double,
    add_date_time timestamp,
    update_date_time timestamp
);

team (
    team_id varchar(50),
    team_name varchar(100),
    add_date_time timestamp,
    update_date_time timestamp
);

team_members (
    team_member_id varchar(50),
    team_id varchar(50),
    user_id varchar(50),
    role_id varchar(50),
    add_date_time timestamp,
    update_date_time timestamp
);

top_selling_items (
    id int(11),
    country varchar(50),
    quote_id varchar(255),
    item_name varchar(50),
    quantity int(11),
    amount double,
    customer_name varchar(100),
    sfdc_id varchar(100),
    am_id varchar(50),
    sa_id varchar(50),
    cda_id varchar(50),
    region varchar(100),
    add_date_time timestamp,
    update_date_time timestamp
);

user (
    user_id varchar(50),
    name varchar(255),
    email varchar(200),
    username varchar(255),
    password varchar(200),
    active tinyint(4),
    created_by varchar(255),
    profile_photo varchar(250),
    country varchar(50),
    isMasterAdmin smallint(6),
    last_logged_in timestamp,
    last_password_update timestamp,
    last_quote_created timestamp,
    last_quote_approved timestamp,
    last_quote_rejected timestamp,
    add_date_time timestamp,
    update_date_time timestamp,
    failed_attempts int(11),
    lockout_time timestamp,
    token_expiry timestamp,
    user_agent varchar(255)
);

user_role (
    user_role_id varchar(50),
    role_name varchar(50),
    active tinyint(4),
    parent_id varchar(50),
    add_date_time timestamp,
    update_date_time timestamp
);

virtual_machine (
    id int(11),
    region_id int(11),
    country_id int(11),
    type varchar(30),
    infrastructure varchar(100),
    infrastructure_id int(11),
    series_id int(11),
    os_id int(11),
    vm_name varchar(100),
    old_vm_name varchar(100),
    vcpu double,
    vram double,
    kdump smallint(6),
    page smallint(6),
    kdump_size double,
    page_size double,
    default_root_disk double,
    code_type double,
    static_physical_core double,
    gcc double,
    india_ipc_nodes double,
    international_ipc_nodes double,
    high_connection double,
    vcpu_ratio_vram double,
    reserved_rate double,
    monthly_rate double,
    daily_rate double,
    hourly_rate double,
    add_date_time timestamp,
    update_date_time timestamp
);

vm_common_parameters (
    id int(11),
    country_id int(11),
    country varchar(50),
    type varchar(50),
    balanced_per_vcpu double,
    balance_per_vram double,
    high_config_per_vcpu double,
    high_config_per_gb_vram double,
    computed_i_per_vcpu double,
    computed_i_per_vram double,
    ssd double,
    esxi double,
    management_charge double,
    suse_enterprise_linux_1_2_vcore double,
    suse_enterprise_linux_3_4_vcore double,
    suse_enterprise_linux_5_plus_vcore double,
    windows_server_enterprise_per_2_physical_core double,
    centos_or_ubuntu double,
    rhel_small_vm double,
    rhel_large_vm double,
    add_date_time timestamp,
    update_date_time timestamp
);

vm_flavours (
    id bigint(20) unsigned,
    series_id bigint(20) unsigned,
    os_id bigint(20) unsigned,
    location varchar(255),
    disp_odr int(11),
    flavour_name varchar(255),
    root_storage int(11),
    v_cpu int(11),
    ram int(11),
    hourly_rate varchar(255),
    daily_rate_based_on_hourly_rate varchar(255),
    monthly_rate_based_on_hourly_rate varchar(255),
    reserved_1_year_per_month_rate varchar(255),
    reserved_3_year_per_month_rate varchar(255),
    add_date_time timestamp,
    update_date_time timestamp
);

vm_pricing (
    id int(11),
    country_id int(11),
    country varchar(50),
    type varchar(50),
    cost double,
    price double,
    divisor int(11),
    disc_applied varchar(20),
    add_date_time timestamp,
    update_date_time timestamp
);

vm_windows_configuration (
    id int(11),
    code varchar(100),
    value double,
    add_date_time timestamp,
    update_date_time timestamp
);

vpn_gateway_service (
    id int(11),
    no_of_connections int(11),
    country_id int(11),
    price double,
    cost double,
    add_date_time timestamp,
    update_date_time timestamp
);

vpn_service (
    id int(11),
    no_of_connections int(11),
    country_id int(11),
    price double,
    cost double,
    add_date_time timestamp,
    update_date_time timestamp
)
      **It's important to be flexible with table names. Users might use slightly different names than the exact schema.  If the user refers to a table name that is not an exact match but is semantically similar to a table in the schema, you should intelligently map it to the correct table. For example, if the user says "country", and the schema has a table named "countries", you should understand that "country" refers to the "countries" table.**  Focus on understanding the user's intent and choose the most appropriate table from the schema based on the context.
    `,
    tools: {
      executeSQLQuery: {
        description: 'Executes a SQL query against the database and returns the results. Only use this tool for retrieval queries (SELECT statements). Do not use for any data modification queries like INSERT, UPDATE, DELETE, etc.',
        parameters: z.object({
          sqlQuery: z
            .string()
            .describe('The SQL query to execute. MUST be a SELECT or SHOW query.'),
        }),
        execute: async ({ sqlQuery }: { sqlQuery: string }) => {

          const queryResult = await runGenerateSQLQuery(sqlQuery);

          return queryResult;
        },
      },

    },
  });

  return result.toDataStreamResponse();
}