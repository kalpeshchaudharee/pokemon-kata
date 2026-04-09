import { render, screen } from "@testing-library/react";
import Home from "@/pages/index";
import { __internalClearApiCacheForTests } from "@/lib/api";

describe("Pokemon listing page", () => {
  afterEach(() => {
    delete (global as unknown as { fetch?: unknown }).fetch;
    __internalClearApiCacheForTests();
  });

  it("shows a loading state while fetching", () => {
    (global as unknown as { fetch: jest.Mock }).fetch = jest
      .fn()
      .mockImplementation(() => new Promise(() => {}));

    render(<Home />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("renders pokemon cards from the API response", async () => {
    (global as unknown as { fetch: jest.Mock }).fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        results: [
          { name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/" },
          { name: "ivysaur", url: "https://pokeapi.co/api/v2/pokemon/2/" },
        ],
      }),
    } as unknown as Response);

    render(<Home />);

    expect(await screen.findByText(/bulbasaur/i)).toBeInTheDocument();
    expect(screen.getByText(/ivysaur/i)).toBeInTheDocument();
  });
});

