package com.banijjo.Banjijjo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;

import com.banijjo.Banjijjo.model.User;
import com.banijjo.Banjijjo.model.Course;
import com.banijjo.Banjijjo.repository.UserRepository;
import com.banijjo.Banjijjo.repository.CourseRepository;
import java.time.OffsetDateTime;

@SpringBootApplication
public class BanjijjoApplication {

	public static void main(String[] args) {
		SpringApplication.run(BanjijjoApplication.class, args);
	}

	@Bean
	public CommandLineRunner seedData(UserRepository userRepo, CourseRepository courseRepo) {
		return args -> {
			try {
				if (userRepo.count() == 0) {
					User admin = new User();
					admin.setName("Admin");
					admin.setEmail("admin@local");
					admin.setPassword("admin");
					admin.setRole("admin");
					userRepo.save(admin);
				}

				if (courseRepo.count() == 0) {
					// find an admin id to set as createdBy
					Long adminId = userRepo.findByEmail("admin@local").map(User::getId).orElse(null);
					if (adminId == null) adminId = 1L;

					Course c1 = new Course();
					c1.setTitle("Investing 101: Foundations");
					c1.setDescription("A beginner-friendly course that covers the basics of investing, risk management, and portfolio construction.");
					c1.setSyllabus("Week 1: Markets & Instruments\nWeek 2: Stocks & ETFs\nWeek 3: Risk Management\nWeek 4: Building a Portfolio");
					c1.setScheduleNotes("6 weekly sessions with live Q&A on Fridays");
					c1.setStartAt(OffsetDateTime.now().plusDays(7));
					c1.setEndAt(OffsetDateTime.now().plusDays(49));
					c1.setCreatedBy(adminId);
					courseRepo.save(c1);

					Course c2 = new Course();
					c2.setTitle("Options Trading: Practical Guide");
					c2.setDescription("Hands-on introduction to options strategies, pricing, and risk management.");
					c2.setSyllabus("Week 1: Options basics\nWeek 2: Spreads\nWeek 3: Volatility\nWeek 4: Strategy lab");
					c2.setScheduleNotes("Recorded lessons + strategy labs on weekends");
					c2.setStartAt(OffsetDateTime.now().plusDays(3));
					c2.setEndAt(OffsetDateTime.now().plusDays(31));
					c2.setCreatedBy(adminId);
					courseRepo.save(c2);

					Course c3 = new Course();
					c3.setTitle("Fundamentals of Technical Analysis");
					c3.setDescription("Learn charting, indicators, trend analysis and how to build a rules-based trading plan.");
					c3.setSyllabus("Week 1: Candlesticks & Price Action\nWeek 2: Moving averages & crossovers\nWeek 3: RSI, MACD and momentum\nWeek 4: Putting it together");
					c3.setScheduleNotes("Weekly live chart walkthroughs");
					c3.setStartAt(OffsetDateTime.now().plusDays(10));
					c3.setEndAt(OffsetDateTime.now().plusDays(40));
					c3.setCreatedBy(adminId);
					courseRepo.save(c3);

					Course c4 = new Course();
					c4.setTitle("Portfolio Construction & Asset Allocation");
					c4.setDescription("A practical guide to building diversified portfolios, rebalancing and risk budgeting.");
					c4.setSyllabus("Week 1: Asset classes & correlation\nWeek 2: Risk parity & factor exposure\nWeek 3: Rebalancing strategies\nWeek 4: Measuring performance");
					c4.setScheduleNotes("Bi-weekly workshops and a capstone portfolio project");
					c4.setStartAt(OffsetDateTime.now().plusDays(14));
					c4.setEndAt(OffsetDateTime.now().plusDays(70));
					c4.setCreatedBy(adminId);
					courseRepo.save(c4);
                    
					Course c5 = new Course();
					c5.setTitle("Algorithmic Trading Basics");
					c5.setDescription("Intro to algorithmic trading, backtesting and simple strategy implementation.");
					c5.setSyllabus("Week 1: Strategy ideation\nWeek 2: Backtesting fundamentals\nWeek 3: Execution considerations\nWeek 4: Risk controls");
					c5.setScheduleNotes("Hands-on coding sessions (Python) and datasets provided");
					c5.setStartAt(OffsetDateTime.now().plusDays(21));
					c5.setEndAt(OffsetDateTime.now().plusDays(63));
					c5.setCreatedBy(adminId);
					courseRepo.save(c5);
				}
			} catch (Exception ex) {
				// Do not fail startup on seeding issues
				System.err.println("Seed data error: " + ex.getMessage());
			}
		};
	}
}
