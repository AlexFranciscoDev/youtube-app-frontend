import { validateEmail, validatePassword, validateUsername, validateConfirmPassword, validateProfileImage} from "./validators";
import { Register } from "../pages/Register";
// import { render, fireEvent } from "@testing-library/react";

describe("validators", () => {
    describe("validateEmail", () => {
        it("should return error if email is empty", () => {
            const error = validateEmail("");
            expect(error).toBe("Email is required");
        })
        it("check if email format is correct", () => {
            const error = validateEmail("test.com");
            expect(error).toBe("Invalid email format");
        })
        it("Correct email should return empty string", () => {
            const error = validateEmail("test@example.com");
            expect(error).toBe("");

        })
    })

    describe("validatePassword", () => {
        it("should return error if password is empty", () => {
            const error = validatePassword("");
            expect(error).toBe("Password is required");
        })

        it("password is less than 5 characters", () => {
            const error = validatePassword("dwq");
            expect(error).toBe("Password must be at least 5 characters");
        })

        it("Correct password should return empty string", () => {
            const error = validatePassword("password123");
            expect(error).toBe("");
        })
    })

    describe("validateUsername", () => {
        it("should return error if username is empty", () => {
            const error = validateUsername("");
            expect(error).toBe("Username is required");
        })

        it("Should return error if username is less than 5 characters", () => {
            const error = validateUsername("adsf");
            expect(error).toBe("Username must be at least 5 characters")
        })

        it("Should return error if username contains spaces", () => {
            const error = validateUsername("hello world");
            expect(error).toBe("Username cannot contain spaces")
        })

        it("Correct username should return empty string", () => {
            const error = validateUsername("Username1234");
            expect(error).toBe("");
        })
    })

    describe("validateConfirmPassword", () => {
        it("should return error if confirm password is empty", () => {
            const error = validateConfirmPassword("", "password123");
            expect(error).toBe("Please confirm your password");
        })

        it ("should return error if confirm password does not match", () => {
            const error = validateConfirmPassword("password321", "password123");
            expect(error).toBe("Passwords do not match");
        })

        it ("Correct confirm password should return empty string", () => {
            const error = validateConfirmPassword("password123", "password123");
            expect(error).toBe("");
        })
    })

    describe("validateprofileImage", () => {
        it("should return error if profile image is not provided", () => {
            const error = validateProfileImage(null);
            expect(error).toBe("Profile image is required");
        })
        
        it("should return empty string if profile image is provided", () => {
            const file = new File([""], "profile.png", { type: "image/png" });
            const error = validateProfileImage(file);
            expect(error).toBe("");
        })
    })    
})