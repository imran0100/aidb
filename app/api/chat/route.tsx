// // // import { openai } from '@ai-sdk/openai';
// // // import { streamText,tool } from 'ai';

// // // // Allow streaming responses up to 30 seconds
// // // export const maxDuration = 30;

// // // export async function POST(req: Request) {
// // //     try{
// // //   const { messages } = await req.json();
// // // console
// // // .log(messages,"messages11")
// // //   const result = streamText({
// // //     model: openai('gpt-4-turbo'),
    
// // //     system: 'You are a helpful assistant.',
// // //     messages,
// // //   });

// // //   return result.toDataStreamResponse();
// // // }catch(err){
// // //     console.log(err,"err")
// // //     return new Response(JSON.stringify({ error: 'Error' }), {
// // //         status: 500,
// // //         headers: { 'Content-Type': 'application/json' },
// // //       });
// // // }
// // // }
// // import { openai } from '@ai-sdk/openai';
// // import { generateObject } from 'ai';
// // import { z } from 'zod';
// // import mysql from 'mysql2/promise'; // Import mysql2/promise for MySQL

// // // Database connection configuration (move to environment variables for production!)
// // const dbConfig = {
// //     host: process.env.MYSQL_HOST || 'localhost', // Use environment variables
// //     user: process.env.MYSQL_USER || 'root',
// //     password: process.env.MYSQL_PASSWORD || '',
// //     database: process.env.MYSQL_DATABASE || '4-3-25',
// // };


// // export async function POST(req: Request) { //  <-  Make sure your function is named POST and exported
// //   try {
// //     const { messages } = await req.json();
// //     console.log(messages, "messages11");

// //     const query = await generateQuery(messages[messages.length - 1].content); // Assuming the last message is user input
// //     console.log("Generated Query:", query);

// //     if (!query) {
// //         return new Response(JSON.stringify({ error: 'Could not generate SQL query' }), {
// //             status: 400,
// //             headers: { 'Content-Type': 'application/json' },
// //         });
// //     }

// //     const results = await runGenerateSQLQuery(query);
// //     console.log("Query Results:", results);

// //     const chartConfig = await generateChartConfig(results, messages[messages.length - 1].content);
// //     console.log("Chart Config:", chartConfig);


// //     return new Response(JSON.stringify({ query, results, chartConfig }), { // Return query, results, and chartConfig
// //       status: 200,
// //       headers: { 'Content-Type': 'application/json' },
// //     });

// //   } catch (err: any) { // It's good practice to type the error as 'any' or 'Error'
// //     console.error(err, "err");
// //     return new Response(JSON.stringify({ error: 'Error processing request', details: err.message || String(err) }), {
// //       status: 500,
// //       headers: { 'Content-Type': 'application/json' },
// //     });
// //   }
// // }



// // async function generateQuery(input: string) { // Keep generateQuery as an internal helper function
// //     "use server";
// //     try {
// //       const result = await generateObject({
// //         model: openai("gpt-4o"),
// //         system: `You are a SQL (mysql) and data visualization expert. Your job is to help the user write a SQL query to retrieve the data they need. The database schema is as follows (example schemas - adjust to match your actual database):
  
// //         users (
// //             id VARCHAR(40) PRIMARY KEY, -- Primary Key (varchar)
// //             name VARCHAR(250),
// //             email VARCHAR(250) UNIQUE, -- Unique Index
// //             password VARCHAR(1000) NOT NULL,
// //             phone_no VARCHAR(14) NOT NULL,
// //             organization_id VARCHAR(40) NOT NULL,
// //             is_email_verify TINYINT(1), -- Boolean-like, 0 or 1
// //             is_mobile_verify TINYINT(1), -- Boolean-like, 0 or 1
// //             is_active TINYINT(1),      -- Boolean-like, 0 or 1
// //             add_date_time TIMESTAMP(3),
// //             lastname VARCHAR(250),
// //             referral_by VARCHAR(200),
// //             phone_code VARCHAR(10),
// //             country_code INT,
// //             region_code INT,
// //             timezone TEXT,
// //             otp VARCHAR(11),
// //             gl_client_id VARCHAR(50),
// //             gl_profile_image VARCHAR(50),
// //             language_id VARCHAR(11),   -- e.g., 'en' for English
// //             default_language VARCHAR(10),
// //             password_change_attempts INT UNSIGNED,
// //             last_password_change_timestamp TIMESTAMP
// //         );
  
    
  
  
// //       Only retrieval queries are allowed.
  
// //       For things like names, emails, phone numbers, roles, organization names, and other string fields, use the ILIKE operator and convert both the search term and the field to lowercase using LOWER() function. For example: LOWER(name) LIKE LOWER('%search_term%'). -- MySQL uses LIKE for case-insensitive search
  
// //       When answering questions about a specific field, ensure you are selecting the identifying column(s) along with the requested field. For example, 'What is the email of user named John Doe?' would select 'name' and 'email' from the 'users' table. For users table, 'id' and 'email' can be considered as identifying columns.
  
// //       Assume that relationships might exist between tables based on common sense (e.g., users belong to organizations, quotations might be associated with users or organizations). If unsure about relationships, start with single-table queries.
  
// //       EVERY QUERY SHOULD RETURN QUANTITATIVE DATA THAT CAN BE PLOTTED ON A CHART if possible! There should always be at least one or two columns that can be used for visualization (e.g., counts, sums, categories). If the user asks for a single column, return the column and the count of the column. If the user asks for a rate, return the rate as a decimal. For example, 0.1 would be 10%.
// //       `,
// //         prompt: `Generate the query necessary to retrieve the data the user wants, using the provided table schemas: ${input}`,
// //         schema: z.object({
// //           query: z.string(),
// //         }),
// //       });
// //       return result.object.query;
// //     } catch (e) {
// //       console.error(e);
// //       throw new Error("Failed to generate query");
// //     }
// //   }

// // async function runGenerateSQLQuery(query: string) { // Keep runGenerateSQLQuery as an internal helper function
// //   "use server";
// //   // Check if the query is a SELECT statement
// //   if (
// //     !query.trim().toLowerCase().startsWith("select") ||
// //     query.trim().toLowerCase().includes("drop") ||
// //     query.trim().toLowerCase().includes("delete") ||
// //     query.trim().toLowerCase().includes("insert") ||
// //     query.trim().toLowerCase().includes("update") ||
// //     query.trim().toLowerCase().includes("alter") ||
// //     query.trim().toLowerCase().includes("truncate") ||
// //     query.trim().toLowerCase().includes("create") ||
// //     query.trim().toLowerCase().includes("grant") ||
// //     query.trim().toLowerCase().includes("revoke")
// //   ) {
// //     throw new Error("Only SELECT queries are allowed");
// //   }

// //   let data: any;
// //   try {
// //     const connection = await mysql.createConnection(dbConfig); // Create MySQL connection
// //     const [rows, fields] = await connection.execute(query); // Execute query
// //     data = rows; // MySQL returns rows directly in `rows`
// //     await connection.end(); // Close connection
// //   } catch (e: any) {
// //     if (e.message.includes('Unknown table \'your_db_name.unicorns\'') || e.message.includes("Table 'unicorns' doesn't exist")) { // MySQL error for table not found
// //       console.log(
// //         "Table does not exist, creating and seeding it with dummy data now...",
// //       );
// //       // throw error -  In a real application, you might want to create the table and seed it here if appropriate for your use case.
// //       // For now, throwing an error as in the original code.
// //       throw Error("Table does not exist");
// //     } else {
// //       throw e;
// //     }
// //   }

// //   return data; // Removed Result[] type, now returning 'any'
// // }

// // async function explainQuery(input: string, sqlQuery: string) { // Keep explainQuery as an internal helper function
// //   "use server";
// //   try {
// //     const result = await generateObject({
// //       model: openai("gpt-4o"),
// //       schema: z.object({
// //         explanations: z.any(), // Removed explanationsSchema, using z.any() for schema
// //       }),
// //       system: `You are a SQL (mysql) expert. Your job is to explain to the user write a SQL query you wrote to retrieve the data they asked for. The table schema is as follows:
// //     unicorns (
// //       id INT AUTO_INCREMENT PRIMARY KEY, -- MySQL AUTO_INCREMENT for primary key
// //       company VARCHAR(255) NOT NULL UNIQUE,
// //       valuation DECIMAL(10, 2) NOT NULL,
// //       date_joined DATE,
// //       country VARCHAR(255) NOT NULL,
// //       city VARCHAR(255) NOT NULL,
// //       industry VARCHAR(255) NOT NULL,
// //       select_investors TEXT NOT NULL
// //     );

// //     When you explain you must take a section of the query, and then explain it. Each "section" should be unique. So in a query like: "SELECT * FROM unicorns limit 20", the sections could be "SELECT *", "FROM UNICORNS", "LIMIT 20".
// //     If a section doesnt have any explanation, include it, but leave the explanation empty.

// //     `,
// //       prompt: `Explain the SQL query you generated to retrieve the data the user wanted. Assume the user is not an expert in SQL. Break down the query into steps. Be concise.

// //       User Query:
// //       ${input}

// //       Generated SQL Query:
// //       ${sqlQuery}`,
// //     });
// //     return result.object;
// //   } catch (e) {
// //     console.error(e);
// //     throw new Error("Failed to generate query");
// //   }
// // }

// // async function generateChartConfig( // Keep generateChartConfig as an internal helper function
// //   results: any, // Removed Result[] type, using 'any'
// //   userQuery: string,
// // ) {
// //   "use server";
// //   const system = `You are a data visualization expert. `;

// //   try {
// //     const { object: config } = await generateObject({
// //       model: openai("gpt-4o"),
// //       system,
// //       prompt: `Given the following data from a SQL query result, generate the chart config that best visualises the data and answers the users query.
// //       For multiple groups use multi-lines.

// //       Here is an example complete config:
// //       export const chartConfig = {
// //         type: "pie",
// //         xKey: "month",
// //         yKeys: ["sales", "profit", "expenses"],
// //         colors: {
// //           sales: "#4CAF50",    // Green for sales
// //           profit: "#2196F3",   // Blue for profit
// //           expenses: "#F44336"  // Red for expenses
// //         },
// //         legend: true
// //       }

// //       User Query:
// //       ${userQuery}

// //       Data:
// //       ${JSON.stringify(results, null, 2)}`,
// //       schema: z.any(), // Removed configSchema, using z.any() for schema
// //     });

// //     const colors: Record<string, string> = {};
// //     if (config.yKeys) {
// //         config.yKeys.forEach((key: string, index: number) => {
// //           colors[key] = `hsl(var(--chart-${index + 1}))`;
// //         });
// //     }


// //     return { config: config as any }; // Removed Config type, casting to 'any'
// //   } catch (e) {
// //     // @ts-expect-errore
// //     console.error(e.message);
// //     throw new Error("Failed to generate chart suggestion");
// //   }
// // }

// import { openai } from '@ai-sdk/openai';
// import { generateObject } from 'ai';
// import { z } from 'zod';
// import mysql from 'mysql2/promise'; // Import mysql2/promise for MySQL

// // Database connection configuration (move to environment variables for production!)
// const dbConfig = {
//     host: process.env.MYSQL_HOST || 'localhost', // Use environment variables
//     user: process.env.MYSQL_USER || 'root',
//     password: process.env.MYSQL_PASSWORD || '',
//     database: process.env.MYSQL_DATABASE || '4-3-25',
// };


// export async function POST(req: Request) { //  <-  Make sure your function is named POST and exported
//   try {
//     const { messages } = await req.json();
//     console.log(messages, "messages11");

//     const query = await generateQuery(messages[messages.length - 1].content); // Assuming the last message is user input
//     console.log("Generated Query:", query);

//     if (!query) {
//         return new Response(JSON.stringify({ error: 'Could not generate SQL query' }), {
//             status: 400,
//             headers: { 'Content-Type': 'application/json' },
//         });
//     }

//     const results = await runGenerateSQLQuery(query);
//     console.log("Query Results:", results);


//     return new Response(JSON.stringify({ query, results }), { // Return query and results
//       status: 200,
//       headers: { 'Content-Type': 'application/json' },
//     });

//   } catch (err: any) { // It's good practice to type the error as 'any' or 'Error'
//     console.error(err, "err");
//     return new Response(JSON.stringify({ error: 'Error processing request', details: err.message || String(err) }), {
//       status: 500,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   }
// }


// async function generateQuery(input: string) { // Keep generateQuery as an internal helper function
//   "use server";
//   try {
//     const result = await generateObject({
//       model: openai("gpt-4o"),
//       system: `You are a SQL (mysql) expert. Your job is to help the user write a SQL query to retrieve the data they need. The database schema is as follows (example schemas - adjust to match your actual database):

//       users (
//           id VARCHAR(40) PRIMARY KEY, -- Primary Key (varchar)
//           name VARCHAR(250),
//           email VARCHAR(250) UNIQUE, -- Unique Index
//           password VARCHAR(1000) NOT NULL,
//           phone_no VARCHAR(14) NOT NULL,
//           organization_id VARCHAR(40) NOT NULL,
//           is_email_verify TINYINT(1), -- Boolean-like, 0 or 1
//           is_mobile_verify TINYINT(1), -- Boolean-like, 0 or 1
//           is_active TINYINT(1),      -- Boolean-like, 0 or 1
//           add_date_time TIMESTAMP(3),
//           lastname VARCHAR(250),
//           referral_by VARCHAR(200),
//           phone_code VARCHAR(10),
//           country_code INT,
//           region_code INT,
//           timezone TEXT,
//           otp VARCHAR(11),
//           gl_client_id VARCHAR(50),
//           gl_profile_image VARCHAR(50),
//           language_id VARCHAR(11),   -- e.g., 'en' for English
//           default_language VARCHAR(10),
//           password_change_attempts INT UNSIGNED,
//           last_password_change_timestamp TIMESTAMP
//       );

//       quotation (
//           id INT AUTO_INCREMENT PRIMARY KEY,
//           quotation_number VARCHAR(255) UNIQUE,
//           date_created DATE,
//           total_amount DECIMAL(10, 2),
//           status VARCHAR(255),
//           -- ... other quotation related fields
//           user_id INT -- Example FK to users table, if quotation is related to a user
//       );

//       resources (
//           id INT AUTO_INCREMENT PRIMARY KEY,
//           resource_name VARCHAR(255) NOT NULL,
//           resource_type VARCHAR(255),
//           cost_per_unit DECIMAL(10, 2),
//           -- ... other resource related fields
//       );

//       organization (
//           id INT AUTO_INCREMENT PRIMARY KEY,
//           organization_name VARCHAR(255) UNIQUE,
//           industry VARCHAR(255),
//           country VARCHAR(255),
//           -- ... other organization related fields
//       );


//     Only retrieval queries are allowed.

//     For things like names, emails, phone numbers, roles, organization names, and other string fields, use the ILIKE operator and convert both the search term and the field to lowercase using LOWER() function. For example: LOWER(name) LIKE LOWER('%search_term%'). -- MySQL uses LIKE for case-insensitive search

//     When answering questions about a specific field, ensure you are selecting the identifying column(s) along with the requested field. For example, 'What is the email of user named John Doe?' would select 'name' and 'email' from the 'users' table. For users table, 'id' and 'email' can be considered as identifying columns.

//     Assume that relationships might exist between tables based on common sense (e.g., users belong to organizations, quotations might be associated with users or organizations). If unsure about relationships, start with single-table queries.

//     Try to return data that is numerically aggregatable where possible. If not possible return the data as is.
//     `,
//       prompt: `Generate the query necessary to retrieve the data the user wants, using the provided table schemas: ${input}`,
//       schema: z.object({
//         query: z.string(),
//       }),
//     });
//     return result.object.query;
//   } catch (e) {
//     console.error(e);
//     throw new Error("Failed to generate query");
//   }
// }

// async function runGenerateSQLQuery(query: string) { // Keep runGenerateSQLQuery as an internal helper function
//   "use server";
//   // Check if the query is a SELECT statement
//   if (
//     !query.trim().toLowerCase().startsWith("select") ||
//     query.trim().toLowerCase().includes("drop") ||
//     query.trim().toLowerCase().includes("delete") ||
//     query.trim().toLowerCase().includes("insert") ||
//     query.trim().toLowerCase().includes("update") ||
//     query.trim().toLowerCase().includes("alter") ||
//     query.trim().toLowerCase().includes("truncate") ||
//     query.trim().toLowerCase().includes("create") ||
//     query.trim().toLowerCase().includes("grant") ||
//     query.trim().toLowerCase().includes("revoke")
//   ) {
//     throw new Error("Only SELECT queries are allowed");
//   }

//   let data: any;
//   try {
//     const connection = await mysql.createConnection(dbConfig); // Create MySQL connection
//     const rows = await connection.execute(query); // Execute query
//     console.log(rows, "rows")
//     data = rows; // MySQL returns rows directly in `rows`
//     await connection.end(); // Close connection
//   } catch (e: any) {
//     if (e.message.includes('Unknown table \'your_db_name.unicorns\'') || e.message.includes("Table 'unicorns' doesn't exist")) { // MySQL error for table not found
//       console.log(
//         "Table does not exist, creating and seeding it with dummy data now...",
//       );
//       // throw error -  In a real application, you might want to create the table and seed it here if appropriate for your use case.
//       // For now, throwing an error as in the original code.
//       throw Error("Table does not exist");
//     } else {
//       throw e;
//     }
//   }

//   return data; // Removed Result[] type, now returning 'any'
// }

// async function explainQuery(input: string, sqlQuery: string) { // Keep explainQuery as an internal helper function
//   "use server";
//   try {
//     const result = await generateObject({
//       model: openai("gpt-4o"),
//       schema: z.object({
//         explanations: z.any(), // Removed explanationsSchema, using z.any() for schema
//       }),
//       system: `You are a SQL (mysql) expert. Your job is to explain to the user write a SQL query you wrote to retrieve the data they asked for. The table schema is as follows:
    // users (
    //       id VARCHAR(40) PRIMARY KEY, -- Primary Key (varchar)
    //       name VARCHAR(250),
    //       email VARCHAR(250) UNIQUE, -- Unique Index
    //       password VARCHAR(1000) NOT NULL,
    //       phone_no VARCHAR(14) NOT NULL,
    //       organization_id VARCHAR(40) NOT NULL,
    //       is_email_verify TINYINT(1), -- Boolean-like, 0 or 1
    //       is_mobile_verify TINYINT(1), -- Boolean-like, 0 or 1
    //       is_active TINYINT(1),      -- Boolean-like, 0 or 1
    //       add_date_time TIMESTAMP(3),
    //       lastname VARCHAR(250),
    //       referral_by VARCHAR(200),
    //       phone_code VARCHAR(10),
    //       country_code INT,
    //       region_code INT,
    //       timezone TEXT,
    //       otp VARCHAR(11),
    //       gl_client_id VARCHAR(50),
    //       gl_profile_image VARCHAR(50),
    //       language_id VARCHAR(11),   -- e.g., 'en' for English
    //       default_language VARCHAR(10),
    //       password_change_attempts INT UNSIGNED,
    //       last_password_change_timestamp TIMESTAMP
    //   );

//       quotation (
//           id INT AUTO_INCREMENT PRIMARY KEY,
//           quotation_number VARCHAR(255) UNIQUE,
//           date_created DATE,
//           total_amount DECIMAL(10, 2),
//           status VARCHAR(255),
//           -- ... other quotation related fields
//           user_id INT -- Example FK to users table, if quotation is related to a user
//       );

//       resources (
//           id INT AUTO_INCREMENT PRIMARY KEY,
//           resource_name VARCHAR(255) NOT NULL,
//           resource_type VARCHAR(255),
//           cost_per_unit DECIMAL(10, 2),
//           -- ... other resource related fields
//       );

//       organization (
//           id INT AUTO_INCREMENT PRIMARY KEY,
//           organization_name VARCHAR(255) UNIQUE,
//           industry VARCHAR(255),
//           country VARCHAR(255),
//           -- ... other organization related fields
//       );

//     When you explain you must take a section of the query, and then explain it. Each "section" should be unique. So in a query like: "SELECT * FROM users limit 20", the sections could be "SELECT *", "FROM users", "LIMIT 20".
//     If a section doesnt have any explanation, include it, but leave the explanation empty.

//     `,
//       prompt: `Explain the SQL query you generated to retrieve the data the user wanted. Assume the user is not an expert in SQL. Break down the query into steps. Be concise.

//       User Query:
//       ${input}

//       Generated SQL Query:
//       ${sqlQuery}`,
//     });
//     return result.object;
//   } catch (e) {
//     console.error(e);
//     throw new Error("Failed to generate query");
//   }
// }


// // Removed generateChartConfig function completely


// async function generateChartConfig( // Keep explainQuery as an internal helper function
//   results: any, // Removed Result[] type, using 'any'
//   userQuery: string,
// ) {
//   "use server";
//   const system = `You are a data visualization expert. `;

//   try {
//     const { object: config } = await generateObject({
//       model: openai("gpt-4o"),
//       system,
//       prompt: `Given the following data from a SQL query result, generate the chart config that best visualises the data and answers the users query.
//       For multiple groups use multi-lines.

//       Here is an example complete config:
//       export const chartConfig = {
//         type: "pie",
//         xKey: "month",
//         yKeys: ["sales", "profit", "expenses"],
//         colors: {
//           sales: "#4CAF50",    // Green for sales
//           profit: "#2196F3",   // Blue for profit
//           expenses: "#F44336"  // Red for expenses
//         },
//         legend: true
//       }

//       User Query:
//       ${userQuery}

//       Data:
//       ${JSON.stringify(results, null, 2)}`,
//       schema: z.any(), // Removed configSchema, using z.any() for schema
//     });

//     const colors: Record<string, string> = {};
//     if (config.yKeys) {
//         config.yKeys.forEach((key: string, index: number) => {
//           colors[key] = `hsl(var(--chart-${index + 1}))`;
//         });
//     }


//     return { config: config as any }; // Removed Config type, casting to 'any'
//   } catch (e) {
//     // @ts-expect-errore
//     console.error(e.message);
//     throw new Error("Failed to generate chart suggestion");
//   }
// }
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
    system: `You are a SQL (mysql) expert. Your job is to help the user write a SQL query to retrieve the data they need. The database schema is as follows (example schemas - adjust to match your actual database):
        users (
          id VARCHAR(40) PRIMARY KEY, -- Primary Key (varchar)
          name VARCHAR(250),
          email VARCHAR(250) UNIQUE, -- Unique Index
          password VARCHAR(1000) NOT NULL,
          phone_no VARCHAR(14) NOT NULL,
          organization_id VARCHAR(40) NOT NULL,
          is_email_verify TINYINT(1), -- Boolean-like, 0 or 1
          is_mobile_verify TINYINT(1), -- Boolean-like, 0 or 1
          is_active TINYINT(1),      -- Boolean-like, 0 or 1
          add_date_time TIMESTAMP(3),
          lastname VARCHAR(250),
          referral_by VARCHAR(200),
          phone_code VARCHAR(10),
          country_code INT,
          region_code INT,
          timezone TEXT,
          otp VARCHAR(11),
          gl_client_id VARCHAR(50),
          gl_profile_image VARCHAR(50),
          language_id VARCHAR(11),   -- e.g., 'en' for English
          default_language VARCHAR(10),
          password_change_attempts INT UNSIGNED,
          last_password_change_timestamp TIMESTAMP
      );
      countries (
  id INT(11) AUTO_INCREMENT PRIMARY KEY,        -- Primary Key (int)
  name VARCHAR(52) NOT NULL,                     -- Country name (varchar)
  alpha2 VARCHAR(2) NOT NULL,                    -- Alpha-2 country code (varchar)
  alpha3 VARCHAR(3) NOT NULL,                    -- Alpha-3 country code (varchar)
  countrycode INT(11) NOT NULL,                  -- Country code (int)
  iso_31662 VARCHAR(13) NOT NULL,                -- ISO 3166-2 country code (varchar)
  region VARCHAR(8) DEFAULT NULL,                -- Region (varchar)
  subregion VARCHAR(31) DEFAULT NULL,            -- Subregion (varchar)
  intermediateregion VARCHAR(15) DEFAULT NULL,   -- Intermediate region (varchar)
  regioncode INT(11) DEFAULT NULL,               -- Region code (int)
  subregioncode INT(11) DEFAULT NULL,            -- Subregion code (int)
  intermediateregioncode INT(11) DEFAULT NULL,   -- Intermediate region code (int)
  phonecode INT(11) DEFAULT NULL,                -- Phone code (int)
  symbol VARCHAR(40) DEFAULT NULL,               -- Currency symbol (varchar)
  currency VARCHAR(40) NOT NULL,                 -- Currency (varchar)
  added_date_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
  )
      and and i have a table name countries if user say country its refer counties table
    `,
    tools: {
      executeSQLQuery: {
        description: 'Executes a SQL query against the database and returns the results. Only use this tool for retrieval queries (SELECT statements). Do not use for any data modification queries like INSERT, UPDATE, DELETE, etc.',
        parameters: z.object({
          sqlQuery: z
            .string()
            .describe('The SQL query to execute. MUST be a SELECT query.'),
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