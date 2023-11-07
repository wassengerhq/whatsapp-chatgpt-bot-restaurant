const { env } = process

// Default message when the user sends an unknown message.
const unknownCommandMessage = `I'm sorry, I didn't understand your query. Can you please provider more details?

If you would like to chat with a person, just reply with *human*.`

// Default welcome message. Change it as you need.
const welcomeMessage = `Welcome to Pizzaiolo 👋 This is a ChatGPT-powered AI virtual assistant chatfot demostration for a Restaurant that can reply to random customers queries and manage bookings. It can also speak many languages 😁`

// AI bot instructions to adjust its bevarior. Change it as you need.
// Use concise and clear instructions.
const botInstructions = `You are a smart virtual customer support assistant who works for Pizzaiolo, an Italian restaurant in the centre of Miami.
You can identify yourself as Molly.
Your responsibility is to reply to customers' queries about the restaurant, menu, prices, location and manage table reservations.
The location of the restaurant is 95 SE 9th St, Miami, FL 33131, United States.
This is the Google Maps location: https://maps.app.goo.gl/Jq4jk8YHL2ecYxVL7
There are paid parking lots in the building nearby. Free parking is not available in the restaurant.
The restaurant is open from 11:00 AM to 11:00 PM, from Tuesday to Sunday.
The restaurant is closed on Mondays.
The restaurant accepts table reservations via WhatsApp. In order to book a table, ask the customer to provide the date, time, full name, contact email and how many people will attend.
The preferred way to contact the restaurant is through WhatsApp.
The contact phone number for the restaurant is: +13053990000.
The restaurant does not have a contact email, please contact us via WhatsApp instead.
The restaurant menu can be found at: https://pizzaiolo.menu
The restaurant offers home delivery orders via UberEats. Please use UberEats to make your online order.
You can order via UberEats using this link: https://ubereats.com/pizzaiolo
The restaurant has a Facebook page: https://www.facebook.com/pizzaiolo
The restaurant has an Instagram page: https://www.instagram.com/pizzaiolo
For special offers and discounts, please check our website: https://pizzaio.menu
The restaurant has a free WiFi network for customers.
The restaurant has vegan and vegetarian options on the menu.
Allergen information is available in the menu.
You are an expert customer support virtual assistant.
Pizza and pasta dishes use the best Italian-neapolitan imported dough and traditional recipes.
Be polite. Be gentle. Be helpful. Be emphatic. Be concise in your responses.
Politely reject any queries that are not related to customer support specifically about the Pizzaiolo restaurant services.
Strictly stick to your role as customer support virtual assistant for Pizzaiolo.
If you can't help with something, ask the user to type *human* in order to talk with a real person.
If customers ask to cancel a reservation, inform them they will find a cancellation email
DO NOT use Markdown in your responses.`

// Default help message. Change it as you need.
const defaultMessage = `Don't be shy 😁 try asking anything to the AI chatbot, using natural language!

Example questions:

1️⃣ Where is the restaurant located?
2️⃣ What are the opening hours?
3️⃣ Do you have vegeration options in the menu?
4️⃣ What are the opening hours?
6️⃣ Do you have free Wi-Fi?
7️⃣ Do you have parking?
8️⃣ Can I book a table?
9️⃣ Can I see the menu?
🔟 Do you deliver?

Type *human* to talk with a person. The chat will be assigned to an available member of our team.

Give it a try! 😁`

// Chatbot config
export default {
  // Optional. Specify the Wassenger device ID (24 characters hexadecimal length) to be used for the chatbot
  // If no device is defined, the first connected device will be used
  // Obtain the device ID in the Wassenger app: https://app.wassenger.com/number
  device: env.DEVICE || 'ENTER WHATSAPP DEVICE ID',

  // Required. Specify the Wassenger API key to be used
  // You can obtain it here: https://app.wassenger.com/apikeys
  apiKey: env.API_KEY || 'ENTER API KEY HERE',

  // Required. Specify the OpenAI API key to be used
  // You can sign up for free here: https://platform.openai.com/signup
  // Obtain your API key here: https://platform.openai.com/account/api-keys
  openaiKey: env.OPENAI_API_KEY || '',

  // Required. Set the OpenAI model to use.
  // You can use a pre-existing model or create your fine-tuned model.
  // Default model: gpt-4-0613
  // Faster model available: gpt-3.5-turbo-0613
  // For customized fine-tuned models, see: https://platform.openai.com/docs/guides/fine-tuning
  openaiModel: env.OPENAI_MODEL || 'gpt-4-0613',

  // Optional. AI callable functions to be interpreted by the AI
  // Using it you can instruct the AI to inform you to execute arbitrary functions
  // in your code based in order to augment information for a specific user query.
  // For example, you can call an external CRM in order to retrieve, save or validate
  // specific information about the customer, such as email, phone number, user ID, etc.
  // Learn more here: https://platform.openai.com/docs/guides/gpt/function-calling
  openaiFunctions: [
    {
      name: 'check_availability_hours',
      description: 'Obtain a list of available hours for a given day',
      parameters: {
        type: 'object',
        properties: {
          date: { type: 'string', format: 'date', default: new Date().toISOString().slice(0, 10) },
          timezone: { type: 'string', format: 'timezone', default: 'America/New_York' }
        },
        required: ['date']
      }
    },
    {
      name: 'confirm_table_reservation',
      description: 'Book a table for a given day, time and number of people.',
      parameters: {
        type: 'object',
        properties: {
          people: { type: 'integer', description: 'For how many people the table booking should be, from 1 up to 12 person.', format: 'int', maximum: 12, minimum: 1 },
          date: { type: 'string', description: 'Day for the table booking', format: 'date', default: new Date().toISOString().slice(0, 10) },
          time: { type: 'string', description: 'Day time for the table booking', format: 'time',  default: new Date().toISOString().slice(11, 16) },
          name: { type: 'string', description: 'Person name and surname for who the table is booked' },
          email: { type: 'string', description: 'Contact email' },
          timezone: { type: 'string', format: 'timezone', default: 'America/New_York' }
        },
        required: ['people', 'date', 'time', 'name', 'email']
      }
    },
    {
      name: 'check_table_date_availability',
      description: 'Check table reservation availability for a given day and time',
      parameters: {
        type: 'object',
        properties: {
          date: { type: 'string', format: 'date', default: new Date().toISOString().slice(0, 10) },
          time: { type: 'string', format: 'time', default: new Date().toISOString().slice(11, 16) },
          timezone: { type: 'string', format: 'timezone', default: 'America/New_York' }
        },
        required: ['date', 'time']
      }
    }
  ],

  // Optional. HTTP server TCP port to be used. Defaults to 8080
  port: +env.PORT || 8080,

  // Optional. Use NODE_ENV=production to run the chatbot in production mode
  production: env.NODE_ENV === 'production',

  // Optional. Specify the webhook public URL to be used for receiving webhook events
  // If no webhook is specified, the chatbot will autoamtically create an Ngrok tunnel
  // and register it as the webhook URL.
  // IMPORTANT: in order to use Ngrok tunnels, you need to sign up for free, see the option below.
  webhookUrl: env.WEBHOOK_URL,

  // Ngrok tunnel authentication token.
  // Required if webhook URL is not provided.
  // sign up for free and get one: https://ngrok.com/signup
  // Learn how to obtain the auth token: https://ngrok.com/docs/agent/#authtokens
  ngrokToken: env.NGROK_TOKEN,

  // Set one or multiple labels on chatbot-managed chats
  setLabelsOnBotChats: ['bot'],

  // Remove labels when the chat is assigned to a person
  removeLabelsAfterAssignment: true,

  // Set one or multiple labels on chatbot-managed chats
  setLabelsOnUserAssignment: ['from-bot'],

  // Optional. Set a list of labels that will tell the chatbot to skip it
  skipChatWithLabels: ['no-bot'],

  // Optional. Ignore processing messages sent by one of the following numbers
  // Important: the phone number must be in E164 format with no spaces or symbols
  numbersBlacklist: ['1234567890'],

  // Optional. Only process messages one of the the given phone numbers
  // Important: the phone number must be in E164 format with no spaces or symbols
  numbersWhitelist: [],

  // Skip chats that were archived in WhatsApp
  skipArchivedChats: true,

  // If true, when the user requests to chat with a human, the bot will assign
  // the chat to a random available team member.
  // You can specify which members are eligible to be assigned using the `teamWhitelist`
  // and which should be ignored using `teamBlacklist`
  enableMemberChatAssignment: true,

  // If true, chats assigned by the bot will be only assigned to team members that are
  // currently available and online (not unavailable or offline)
  assignOnlyToOnlineMembers: false,

  // Optional. Skip specific user roles from being automatically assigned by the chat bot
  // Available roles are: 'admin', 'supervisor', 'agent'
  skipTeamRolesFromAssignment: ['admin'], // 'supervisor', 'agent'

  // Enter the team member IDs (24 characters length) that can be eligible to be assigned
  // If the array is empty, all team members except the one listed in `skipMembersForAssignment`
  // will be eligible for automatic assignment
  teamWhitelist: [],

  // Optional. Enter the team member IDs (24 characters length) that should never be automatically assigned chats to
  teamBlacklist: [],

  // Optional. Set metadata entries on bot-assigned chats
  setMetadataOnBotChats: [
    {
      key: 'bot_start',
      value: () => new Date().toISOString()
    }
  ],

  // Optional. Set metadata entries when a chat is assigned to a team member
  setMetadataOnAssignment: [
    {
      key: 'bot_stop',
      value: () => new Date().toISOString()
    }
  ],

  defaultMessage,
  botInstructions,
  welcomeMessage,
  unknownCommandMessage,
}
