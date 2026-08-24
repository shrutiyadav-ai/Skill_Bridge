import net from "net";
import dns from "dns";

const hostsToTest = [
  { host: "aws-0-ap-southeast-1.pooler.supabase.com", port: 5432 },
  { host: "aws-0-ap-southeast-1.pooler.supabase.com", port: 6543 },
  { host: "aws-0-ap-south-1.pooler.supabase.com", port: 5432 },
  { host: "aws-0-ap-south-1.pooler.supabase.com", port: 6543 },
  { host: "db.tvssgrnpxdqgpzlcdrjn.supabase.co", port: 5432 },
];

async function checkHost(host: string, port: number): Promise<void> {
  return new Promise((resolve) => {
    console.log(`\nChecking DNS for ${host}...`);
    dns.lookup(host, { all: true }, (err, addresses) => {
      if (err) {
        console.log(`❌ DNS lookup failed for ${host}: ${err.message}`);
        return resolve();
      }
      console.log(`✓ DNS resolved ${host} ->`, addresses);

      console.log(`Testing TCP connection to ${host}:${port}...`);
      const socket = new net.Socket();
      socket.setTimeout(5000);

      socket.connect(port, host, () => {
        console.log(`✅ SUCCESS: Connected to ${host}:${port}!`);
        socket.destroy();
        resolve();
      });

      socket.on("error", (e) => {
        console.log(`❌ TCP connection error to ${host}:${port}: ${e.message}`);
        resolve();
      });

      socket.on("timeout", () => {
        console.log(`❌ TCP connection TIMEOUT to ${host}:${port} after 5s`);
        socket.destroy();
        resolve();
      });
    });
  });
}

async function run() {
  console.log("=== Supabase Network & Host Diagnostics ===");
  for (const item of hostsToTest) {
    await checkHost(item.host, item.port);
  }
}

run();
