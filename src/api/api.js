/**
 * api.js
 * Python Compilation Server Client
 */

const COMPILATION_SERVER_URL =
  "https://curdle-imposing-skirmish.ngrok-free.dev";

/**
 * Execute Python code on the remote server.
 *
 * @param {Object} params
 * @param {string} params.code
 * @param {string} [params.stdin]
 *
 * @returns {Promise<{
 * stdout: string,
 * stderr: string,
 * exitCode: number
 * }>}
 */
export async function runCode({
  code,
  stdin = "",
}) {
  try {
    const response = await fetch(
      `${COMPILATION_SERVER_URL}/run`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({
          code,
          stdin,
        }),
      }
    );

    if (!response.ok) {
      let errorMessage = `Server Error (${response.status})`;

      try {
        const errorBody = await response.text();
        if (errorBody) {
          errorMessage = errorBody;
        }
      } catch (_) {}

      throw new Error(errorMessage);
    }

    const data = await response.json();

    return {
      stdout: data.stdout || "",
      stderr: data.stderr || "",
      exitCode: data.exitCode ?? -1,
    };
  } catch (error) {
    if (
      error instanceof TypeError &&
      error.message.toLowerCase().includes("fetch")
    ) {
      throw new Error(
        "Unable to connect to the compilation server."
      );
    }

    throw error;
  }
}

/**
 * Check whether the compilation server is reachable.
 *
 * NOTE:
 * Your current backend does NOT expose /health.
 * Add the endpoint in FastAPI if you want this to work.
 */
export async function pingServer() {
  try {
    const response = await fetch(
      `${COMPILATION_SERVER_URL}/health`,
      {
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      }
    );

    return response.ok;
  } catch {
    return false;
  }
}

export default runCode;
