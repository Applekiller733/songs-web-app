import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SongList from "./SongList";

describe("SongList Component", () => {



test("renders the SongList with initial songs", () => {
    render(<SongList />);
    expect(screen.getByText("Island in the Sun")).toBeInTheDocument();
    expect(screen.getByText("Passenger")).toBeInTheDocument();
    expect(screen.getByText("Don't Fear the Reaper")).toBeInTheDocument();
});

test("filters songs by genre", async () => {
    render(<SongList />);
    const filterButton = screen.getByText("Filter by");
    fireEvent.click(filterButton);

    const genreSelect = screen.getByRole("combobox");
    fireEvent.change(genreSelect, { target: { value: "Rock" } });

    await waitFor(() => {
        expect(screen.getByText("Island in the Sun")).toBeInTheDocument();
        expect(screen.getByText("Don't Fear the Reaper")).toBeInTheDocument();
        expect(screen.queryByText("Passenger")).not.toBeInTheDocument();
    });
});

test("filters songs by artist", async () => {
    render(<SongList />);
    const filterButton = screen.getByText("Filter by");
    fireEvent.click(filterButton);

    const artistInput = screen.getByPlaceholderText("Filter by artist");
    fireEvent.change(artistInput, { target: { value: "Weezer" } });

    await waitFor(() => {
        expect(screen.getByText("Island in the Sun")).toBeInTheDocument();
        expect(screen.queryByText("Don't Fear the Reaper")).not.toBeInTheDocument();
        expect(screen.queryByText("Passenger")).not.toBeInTheDocument();
    });
});

test("adds a new song", async () => {
    render(<SongList />);
    const addButton = screen.getByText("+");
    fireEvent.click(addButton);

    const nameInput = screen.getByPlaceholderText("Song Name");
    const artistInput = screen.getByPlaceholderText("Artist");
    const addSongButton = screen.getByText("Add Song");

    fireEvent.change(nameInput, { target: { value: "New Song" } });
    fireEvent.change(artistInput, { target: { value: "New Artist" } });
    fireEvent.click(addSongButton);

    await waitFor(() => {
        expect(screen.getByText("New Song")).toBeInTheDocument();
    });
});

test("edits a song", async () => {
    render(<SongList />);
    const editButton = screen.getAllByText("Edit")[0];
    fireEvent.click(editButton);

    const nameInput = screen.getByDisplayValue("Island in the Sun");
    const saveButton = screen.getByText("Save Changes");

    fireEvent.change(nameInput, { target: { value: "Updated Song" } });
    fireEvent.click(saveButton);

    await waitFor(() => {
        expect(screen.getByText("Updated Song")).toBeInTheDocument();
    });
});

test("deletes a song", async () => {
    render(<SongList />);
    const deleteButton = screen.getAllByText("Delete")[0];
    fireEvent.click(deleteButton);

    await waitFor(() => {
        expect(screen.queryByText("Island in the Sun")).not.toBeInTheDocument();
    });
});

test("increments listens for a song", async () => {
    render(<SongList />);
    const listenButton = screen.getAllByText("Listen")[0];
    fireEvent.click(listenButton);

    await waitFor(() => {
        expect(screen.getByText("Listens: 1")).toBeInTheDocument();
    });
});

test("increments likes for a song", async () => {
    render(<SongList />);
    const likeButton = screen.getAllByText("Like")[0];
    fireEvent.click(likeButton);

    await waitFor(() => {
        expect(screen.getByText("Likes: 1")).toBeInTheDocument();
    });
});

}
);

